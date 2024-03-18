import { Request, Response } from "express";
import response from '@helpers/response.helper'
import { validateRequest } from "@helpers/validation.helper";
import logger from "@helpers/logger.helper";
import { CreateMessageRequestSchema, MessageListRequestSchema } from "@requests/message.schema";
import { getGroupByGroupUniqueId, isUserBelongsToGroup } from "@datasources/group.datasource";
import NotFoundException from "@exceptions/not-found.exception";
import ChatService from "@services/chat.service";
import { groupMessagesResponse, messageResponse } from "src/response/messages-response";
import UnauthorizedException from "@exceptions/unauthorized.exception";
class MessageController {

    async list(req: Request, res: Response){
        try {       

            const requestData = {
                groupUniqueId: req.params.groupUniqueId
            }

            validateRequest(MessageListRequestSchema, requestData, req);

            const group = await getGroupByGroupUniqueId(req.params.groupUniqueId);
            if(!group) throw new NotFoundException('Invalid group unique id');

            const isUserBelongsToGroupDb = await isUserBelongsToGroup(group.id as number, req.user.id);
            if(!isUserBelongsToGroupDb) throw new UnauthorizedException(`Not Allowed`, undefined, 403);

            const chatService = new ChatService();
            const messages = await chatService.getMessagesByGroup(group);

            return response.success(req, res, groupMessagesResponse(messages));
            
        } catch (err:any) {
            logger.error(err.message, err);
            return response.failed(req, res, err.message, null, err.httpCode);
        }
    }

    async create(req: Request, res: Response){
        try {     

            const requestData = {
                groupUniqueId: req.params.groupUniqueId,
                message: req.body.message
            }
            
            validateRequest(CreateMessageRequestSchema, requestData, req);

            const group = await getGroupByGroupUniqueId(req.params.groupUniqueId);
            if(!group) throw new NotFoundException('Invalid group unique id');

            const isUserBelongsToGroupDb = await isUserBelongsToGroup(group.id as number, req.user.id);
            if(!isUserBelongsToGroupDb) throw new UnauthorizedException(`Not Allowed`, undefined, 403);

            const chatService = new ChatService();
            const message = await chatService.storeMessage(group, req.user, req.body.message);
            message.user = req.user;

            return response.success(req, res, messageResponse(message));
            
        } catch (err:any) {
            logger.error(err.message, err);
            return response.failed(req, res, err.message, null, err.httpCode);
        }
    }
}

export default new MessageController();