
import { WS_CONNECTION_CLOSE_REASON } from "@constants";
import { getGroupByGroupUniqueId } from "@datasources/group.datasource";
import { getMessagesByGroupId, storeMessageDb } from "@datasources/message.datasource";
import Group from "@datasources/models/group.model";
import User from "@datasources/models/user.model";
import { getUserByUniqueId } from "@datasources/user.datasource";
import jwtHelper from "@helpers/jwt.helper";
import logger from "@helpers/logger.helper";
import { RedisHelper } from "@helpers/redis.helper";
import { validateRequest } from "@helpers/validation.helper";
import { MessageReceivedEvent, SocketMessageEvent, StoreMessageDTO } from "@interfaces/chat.interface";
import { MessageReceivedEventSchema } from "@requests/chat.schema";
import { socketMessageEventSchema } from "@requests/ws.schema";
import { WebSocketServer, WebSocket } from "ws";

class ChatService {
    async msgReceived(socketMsg:SocketMessageEvent<MessageReceivedEvent>,  ws:ExtWebSocket, wsServer:WebSocketServer) {
        try {
            // store message
            validateRequest(socketMessageEventSchema(MessageReceivedEventSchema), socketMsg);

            // const user = await getUserByUniqueId(ws.userUniqueId as string);
            // const group = await getGroupByGroupUniqueId(ws.groupUniqueId);

            // const payload = {
            //     userId: user?.id,
            //     groupId: group?.id,
            //     message: socketMsg.data.message
            // } as StoreMessageDTO;

            // await storeMessageDb(payload);

            this.forwardNewMessage(ws, wsServer, socketMsg.data);
        } catch (error) {
            logger.error(`Error at chat service => msgReceived`, error);
        }
    }

    forwardNewMessage(ws:ExtWebSocket, wsServer:WebSocketServer, message:MessageReceivedEvent) {
        wsServer.clients.forEach((client:ExtWebSocket)=>{
            if(client !== ws && client.readyState === WebSocket.OPEN && ws.groupUniqueId === client.groupUniqueId){
                client.send(JSON.stringify({
                    message
                }))
            }
        })
    }

    getMessagesByGroup(group: Group) {
        return getMessagesByGroupId(group?.id as number);
    }

    async storeMessage(group: Group, user:User, message:string) {

        const payload = {
            userId: user?.id,
            groupId: group?.id,
            message
        } as StoreMessageDTO;

        return storeMessageDb(payload)
        
    }
}

export default ChatService;