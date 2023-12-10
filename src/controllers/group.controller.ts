import { Request, Response } from "express";
import response from '@helpers/response.helper'
import { validateRequest } from "@helpers/validation.helper";
import logger from "@helpers/logger.helper";
import { CreateGroupSchema } from "@requests/group.schema";
import GroupService from "@services/group.service";
import { CreateGroupRequest } from "@interfaces/group.interface";
class GroupController {

    async create(req: Request, res: Response){
        try {
            validateRequest(CreateGroupSchema, req.body, req);
            
            const grpService = new GroupService();
            const grp = await grpService.createGroup(req.body as CreateGroupRequest, req.user)

            return response.success(req, res, grp);
            
        } catch (err:any) {
            logger.error(err.message, err);
            return response.failed(req, res, err.message, null, err.httpCode);
        }
    }
}

export default new GroupController();