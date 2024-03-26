import { WebSocketServer } from "ws";
import { EVENTS, WS_CONNECTION_CLOSE_REASON } from "@constants";
import GroupService from "@services/group.service";
import ChatService from "@services/chat.service";
import { verifyWsToken } from "@middelwares/auth.middleware";
import UnauthorizedException from "@exceptions/unauthorized.exception";
import logger from "@helpers/logger.helper";
import { MessageReceivedEvent, SocketMessageEvent } from "@interfaces/chat.interface";
import jwtHelper from "@helpers/jwt.helper";
const url = require('url');

export const socketMsgHandler = (wsServer: WebSocketServer, ws: ExtWebSocket, data: any) => {
    try {
        const socketMsg = JSON.parse(data.toString()) as SocketMessageEvent<any> // we get stringified json from FE
        logger.info(`socket message`, socketMsg);
        switch (socketMsg?.event) {
            case EVENTS.GRP_MSG_RECIEVED:
                const chatService = new ChatService();
                chatService.msgReceived(socketMsg as SocketMessageEvent<MessageReceivedEvent>, ws, wsServer);
                break;
        
            default:
                break;
        }
        
    } catch (error) {
        logger.error(`Error at socketMsgHandler`, error)
    }
}

export const socketConnectionHandler = async (wsServer: WebSocketServer, ws: ExtWebSocket, req:any) => {
    try {
        await verifyWsToken(req, ws);
        const parsedUrl = url.parse(req.url, true);
        const searchParams = parsedUrl.query;
        switch (searchParams.event) {
            case EVENTS.JOIN_GRP:
                const grpService = new GroupService();
                const user = jwtHelper.decodeJwtToken(req.headers['sec-websocket-protocol']);
                grpService.assoicateSocketToUser(searchParams.groupUniqueId, user?.id, ws);
                break;
            default:
                ws.close(WS_CONNECTION_CLOSE_REASON.INVALID_DATA, 'Invalid Event Type');
                break;
        }
    } catch (error) {
        logger.error(`Error at socketConnectionHandler`, error);
        if(error instanceof UnauthorizedException) 
        ws.close(WS_CONNECTION_CLOSE_REASON.POLICY_VIOLATION, 'Unauthorized');
        else ws.close(WS_CONNECTION_CLOSE_REASON.NORMAL_CLOSURE, 'Something went wrong.');
    }

}