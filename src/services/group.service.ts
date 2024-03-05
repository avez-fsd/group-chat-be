
import { WS_CONNECTION_CLOSE_REASON } from "@constants";
import { createGroupDb, getGroupByGroupUniqueId } from "@datasources/group.datasource";
import Group from "@datasources/models/group.model";
import User from "@datasources/models/user.model";
import { addUserToGroup, getUserGroups } from "@datasources/user-group.datasource";
import logger from "@helpers/logger.helper";
import { RedisHelper } from "@helpers/redis.helper";
import { CreateGroupRequest } from "@interfaces/group.interface";
import { v4 as uuidv4 } from 'uuid';

class GroupService {

    async getUserAssociatedGroups(user: User){
        return getUserGroups(user);
    }

    async createGroup(grpData: CreateGroupRequest, user: User){
        grpData.groupUniqueId = uuidv4();
        grpData.createdBy = user?.id;
        const group = await createGroupDb(grpData);
        await this.joinNewMember(group, user);
        return group;
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