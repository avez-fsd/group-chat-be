import dotenv from 'dotenv';
dotenv.config();
import '@datasources/models/connection'

import routes from './routes'
import addRequestId from '@middelwares/request-id.middleware';
import response from "@helpers/response.helper"
import express, { Express, NextFunction, Request, Response } from 'express';
import WebSocket, { WebSocketServer } from 'ws';
import { socketConnectionHandler, socketMsgHandler } from './sockets/socket.handler';
import { verifyWsToken } from '@middelwares/auth.middleware';
import { RedisHelper } from '@helpers/redis.helper';
import { WS_CONNECTION_CLOSE_REASON } from '@constants';

const app = express();

const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(addRequestId);

RedisHelper.getInstance();

app.use('/', routes);

// handle 404 and 5xx http code
app.use(response.handler404);
app.use(response.handler5xx);

const myServer = app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

const wsServer: WebSocketServer = new WebSocket.Server({
    noServer: true,
    clientTracking: true
})  

wsServer.on("connection", async (ws: any, req: Request) => {

    try {
        // await verifyWsToken(req, ws);

        socketConnectionHandler(wsServer, ws, req);

        ws.on("message", function(msg:string) {
            socketMsgHandler(wsServer, ws, msg);
            wsServer.clients.forEach((client:any)=>{
                if(client === ws) console.log('yes', client.clientId, client.roomId)
                else console.log('no', client.clientId, client.roomId)
            })
        })

        ws.on('error', (error:Error) => {
            console.error(`WebSocket error: ${error.message}`);
            // You can customize the error handling here
        });
    } catch (error) {
        console.log(error,'here the error')
        ws.close(WS_CONNECTION_CLOSE_REASON.NORMAL_CLOSURE, 'Something went wrong.');
    }
})

wsServer.on('error', function(error){
    console.log(error)
})


myServer.on('upgrade', async function upgrade(request, socket, head) {
    wsServer.handleUpgrade(request, socket, head, function done(ws) {
      wsServer.emit('connection', ws, request);
    });
});
