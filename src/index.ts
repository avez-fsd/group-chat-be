import dotenv from 'dotenv';
dotenv.config();

import routes from './routes'
import addRequestId from '@middelwares/request-id.middleware';
import response from "@helpers/response.helper"
import express, { Express, NextFunction, Request, Response } from 'express';
import WebSocket, { WebSocketServer } from 'ws';
import { socketMsgHandler } from './sockets/socket.handler';

const app = express();

const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(addRequestId);

app.use('/', routes);

// handle 404 and 5xx http code
app.use(response.handler404);
app.use(response.handler5xx);

const myServer = app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

const wsServer: WebSocketServer = new WebSocket.Server({
    noServer: true
})  

wsServer.on("connection", function(ws: WebSocket) {
    ws.on("message", function(msg) {
        socketMsgHandler(wsServer, ws, msg);
    })
})


myServer.on('upgrade', async function upgrade(request, socket, head) {
    wsServer.handleUpgrade(request, socket, head, function done(ws) {
      wsServer.emit('connection', ws, request);
    });
});
