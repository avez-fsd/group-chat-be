
import { WS_CONNECTION_CLOSE_REASON } from "@constants";
import { createGroupDb } from "@datasources/group.datasource";
import User from "@datasources/models/user.model";
import { RedisHelper } from "@helpers/redis.helper";
import { CreateGroupRequest } from "@interfaces/group.interface";
import { v4 as uuidv4 } from 'uuid';

class GroupService {

    async createGroup(grpData: CreateGroupRequest, user: User){
        grpData.groupId = uuidv4();
        grpData.createdBy = user?.id;
        return createGroupDb(grpData);
    }

    async joinMember(roomId:string, ws:any) {
        if(!roomId){
            ws.close(WS_CONNECTION_CLOSE_REASON.INVALID_DATA, 'Invalid Request Data');
            return;
        }
        ws.roomId = roomId;
    }

}

export default GroupService;