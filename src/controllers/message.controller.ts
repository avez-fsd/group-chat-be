import { Request, Response } from "express";
import response from '@helpers/response.helper'
import { validateRequest } from "@helpers/validation.helper";
import logger from "@helpers/logger.helper";
import GroupService from "@services/group.service";
import { userGroupsResponse } from "src/response/user-groups.response";
import User from "@datasources/models/user.model";
class MessageController {

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

            const grpService = new GroupService();
            const userGroups = await grpService.getUserAssociatedGroups(req.user);

            return response.success(req, res, userGroupsResponse(userGroups as User));
            
        } catch (err:any) {
            logger.error(err.message, err);
            return response.failed(req, res, err.message, null, err.httpCode);
        }
    }
}

export default new MessageController();