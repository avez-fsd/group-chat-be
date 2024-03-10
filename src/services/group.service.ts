
import { WS_CONNECTION_CLOSE_REASON } from "@constants";
import { createGroupDb, getGroupByGroupUniqueId, isPrivateGroupExists } from "@datasources/group.datasource";
import Group from "@datasources/models/group.model";
import User from "@datasources/models/user.model";
import { addUserToGroup, bulkInsertUserGroup, getUserGroups } from "@datasources/user-group.datasource";
import { getUsersByUniqueIds } from "@datasources/user.datasource";
import InvalidRequestException from "@exceptions/invalid-request.exception";
import NotFoundException from "@exceptions/not-found.exception";
import logger from "@helpers/logger.helper";
import { RedisHelper } from "@helpers/redis.helper";
import { CreateGroupRequest } from "@interfaces/group.interface";
import { v4 as uuidv4 } from 'uuid';

class GroupService {

    async getUserAssociatedGroups(user: User){
        return getUserGroups(user);
    }

    async createPrivateGroup(grpData: CreateGroupRequest, user: User) {

        const users = await getUsersByUniqueIds(grpData.users);
        if(users.length === 0) throw new NotFoundException('User not found.');

        const groupExists = await isPrivateGroupExists([user?.id as number, users[0].id as number]);
        if(groupExists) throw new InvalidRequestException('You are alreay friends');

        const payload = {
            name: grpData.name,
            groupUniqueId: uuidv4(),
            isGroup: false,
            createdBy: user?.id
        }

        const group = await createGroupDb(payload);
        if(group) {
            users.push(user);
            const userGroupData = users.map(user=>{
                return {
                    userId: user.id as number,
                    groupId: group.id as number
                }
            })
    
            await bulkInsertUserGroup(userGroupData);
            return group;
        }
        
        return null;
    }

    async createGroup(grpData: CreateGroupRequest, user: User){

        const users = await getUsersByUniqueIds(grpData.users);
        if(users.length === 0) throw new NotFoundException('User not found.');

        const payload = {
            name: grpData.name,
            groupUniqueId: uuidv4(),
            isGroup: true,
            createdBy: user?.id
        }

        const group = await createGroupDb(payload);
        if(group) {
            users.push(user);
            const userGroupData = users.map(user=>{
                return {
                    userId: user.id as number,
                    groupId: group.id as number
                }
            })
            
            await bulkInsertUserGroup(userGroupData);
            return group;
        }

        return null;
    }

    async assoicateSocketToUser(groupUniqueId:string, useUniqueId:string, ws:ExtWebSocket) {
        try {
            const group = await getGroupByGroupUniqueId(groupUniqueId); // can be cached in redis
            if(!group){
                ws.close(WS_CONNECTION_CLOSE_REASON.INVALID_DATA, 'Invalid Request Data');
                return;
            }
            ws.groupUniqueId = groupUniqueId;
            ws.userUniqueId = useUniqueId;
        } catch (error) {
            logger.error(`Error at group service => assoicateSocketToUser`,error)
            ws.close(WS_CONNECTION_CLOSE_REASON.INVALID_DATA, 'Invalid Request Data');
        }
    }

    async joinNewMember(group: Group, user: User) {
        const payload = {
            groupId: group.id,
            userId: user.id
        }
        return addUserToGroup(payload);
    }

    

}

export default GroupService;