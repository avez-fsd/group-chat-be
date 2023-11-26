import { WebSocket, WebSocketServer } from "ws";

export const socketMsgHandler = (wsServer: WebSocketServer, ws: WebSocket, msg: any) => {
    console.log(msg.toString())
}