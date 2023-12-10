import { WebSocket, WebSocketServer } from "ws";
import { v4 as uuidv4 } from 'uuid';
import { EVENTS, WS_CONNECTION_CLOSE_REASON } from "@constants";
import GroupService from "@services/group.service";
const url = require('url');

export const socketMsgHandler = (wsServer: WebSocketServer, ws: WebSocket, msg: any) => {
    try {
        const socketMsg = JSON.parse(msg.toString()) // we get stringified json from FE
        switch (socketMsg.event) {
            case EVENTS.SEND_GRP_MSG:
                wsServer.clients.forEach((client:any)=>{
                    if(client !== ws && client.readyState === WebSocket.OPEN && client.roomId === socketMsg.data.roomId){
                        ws.send(JSON.stringify({
                            message: socketMsg.data.msg
                        }))
                    }
                })
                break;
        
            default:
                break;
        }
        
    } catch (error) {
        console.log(error,'here the error')
    }

}

export const socketConnectionHandler = async (wsServer: WebSocketServer, ws: any, req:any) => {
    const parsedUrl = url.parse(req.url, true);
    const searchParams = parsedUrl.query;
    switch (searchParams.event) {
        case EVENTS.JOIN_GRP_ROOM:
            const grpService = new GroupService();
            grpService.joinMember(searchParams.roomId, ws);
            break;
    
        default:
            ws.close(WS_CONNECTION_CLOSE_REASON.INVALID_DATA, 'Invalid Request Data');
            break;
    }

}