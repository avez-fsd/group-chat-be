import { Request, Response } from "express";
import response from '@helpers/response.helper'
import { validateRequest } from "@helpers/validation.helper";
import logger from "@helpers/logger.helper";
import { CreateGroupSchema, JoinGroupSchema } from "@requests/group.schema";
import GroupService from "@services/group.service";
import { CreateGroupRequest } from "@interfaces/group.interface";
import { getGroupByGroupUniqueId } from "@datasources/group.datasource";
import InvalidRequestException from "@exceptions/invalid-request.exception";
import { userGroupsResponse } from "src/response/user-groups.response";
import User from "@datasources/models/user.model";
import { createGroupResponse } from "src/response/create-group.response";
class GroupController {

    async list(req: Request, res: Response){
        try {            

            const grpService = new GroupService();
            const userGroups = await grpService.getUserAssociatedGroups(req.user);

            return response.success(req, res, userGroupsResponse(userGroups as User));
            
        } catch (err:any) {
            logger.error(err.message, err);
            return response.failed(req, res, err.message, null, err.httpCode);
        }
    }

    async create(req: Request, res: Response){
        try {
            validateRequest(CreateGroupSchema, req.body, req);

            if(req.body.users.includes(req.user?.userUniqueId)) throw new InvalidRequestException('Invalid users data');

            const grpService = new GroupService();
            if(req.body.isGroup) {
                const grp = await grpService.createGroup(req.body as CreateGroupRequest, req.user)
                if(!grp) return response.failed(req, res, "Failed to create a group");
                return response.success(req, res, createGroupResponse(grp));
            }

            const grp = await grpService.createPrivateGroup(req.body as CreateGroupRequest, req.user);
            if(!grp) return response.failed(req, res, "Failed to create a group");

            return response.success(req, res, createGroupResponse(grp));
            
        } catch (err:any) {
            logger.error(err.message, err);
            return response.failed(req, res, err.message, null, err.httpCode);
        }
    }

    async join(req: Request, res: Response){
        try {
            validateRequest(JoinGroupSchema, req.body, req);

            const group = await getGroupByGroupUniqueId(req.body.groupUniqueId);
            if(!group || !group?.isGroup) throw new InvalidRequestException("Invalid group unique Id");

            const grpService = new GroupService();
            const [,created] = await grpService.joinNewMember(group, req.user);
            if(!created) return response.success(req, res, {message: "Success"}, "Success", 202);

            return response.success(req, res, {message: "Success"}, "Success");
            
        } catch (err:any) {
            logger.error(err.message, err);
            return response.failed(req, res, err.message, null, err.httpCode);
        }
    }
}

export default new GroupController();