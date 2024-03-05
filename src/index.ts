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
import { ALLOWED_ORIGINS, WS_CONNECTION_CLOSE_REASON } from '@constants';
import logger from '@helpers/logger.helper';
import cors, { CorsOptions } from 'cors';

const app = express();

const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(addRequestId);

RedisHelper.getInstance();

// Add a list of allowed origins.
// If you have more origins you would like to add, you can add them to the array below.
const options: CorsOptions = {
    origin: ALLOWED_ORIGINS,
    // credentials:true
};
app.use(cors(options));

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

wsServer.on("connection", async (ws: ExtWebSocket, req: Request) => {
    try {
        socketConnectionHandler(wsServer, ws, req);

        ws.on("message", async function(data:string) {
            socketMsgHandler(wsServer, ws, data);
        })

        ws.on('error', (error:Error) => {
            logger.error(`Error at ws connection error event`, error)
        });

    } catch (error) {
        logger.error(`Error at ws connection event`, error)
        ws.close(WS_CONNECTION_CLOSE_REASON.NORMAL_CLOSURE, 'Something went wrong.');
    }
})

wsServer.on('error', function(error){
    logger.error(`Error at ws server error event`, error);
})


myServer.on('upgrade', async function upgrade(request, socket, head) {
    wsServer.handleUpgrade(request, socket, head, function done(ws) {
      wsServer.emit('connection', ws, request);
    });
});

process.on('uncaughtException', (error) => {
    logger.error(`Uncaught Exception`, error)
    // Optionally, you can handle the error gracefully and close connections if needed
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error(`Unhandled Rejection`, reason);
    // Optionally, you can handle the rejection gracefully and close connections if needed
});