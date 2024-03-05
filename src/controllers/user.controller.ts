import { Request, Response } from "express";
import response from '@helpers/response.helper'
import { validateRequest } from "@helpers/validation.helper";
import logger from "@helpers/logger.helper";
import GroupService from "@services/group.service";
import { userGroupsResponse } from "src/response/user-groups.response";
import User from "@datasources/models/user.model";
import { UserSearchSchema } from "@requests/user.schema";
import { getUsers } from "@datasources/user.datasource";
import { userSearchResponse } from "src/response/user-response";

class UserController {

    async search(req: Request, res: Response){
        try {            

        const requestData = {
            page: req.query.page ? parseInt(req.query.page as string) : 1,
            pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string) : 10,
          }

          validateRequest(UserSearchSchema, requestData, req);

          const users = await getUsers(requestData.page, requestData.pageSize, req.query.searchTerm as string);
          return response.success(req, res, userSearchResponse(users));
            
        } catch (err:any) {
            logger.error(err.message, err);
            return response.failed(req, res, err.message, null, err.httpCode);
        }
    }

}

export default new UserController();