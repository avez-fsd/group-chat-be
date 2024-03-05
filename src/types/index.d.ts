import { WebSocketServer, WebSocket } from "ws";

export {}

declare global {
  namespace Express {
    export interface Request {
      rawBody: any;
      requestId?: string;
      requestTime?: string;
      fullURL?: string;
      event?: string
      eventName?: string;
      user?: User;
    }
  }
  export interface ExtWebSocket extends WebSocket {
    groupUniqueId?: sring;
    userUniqueId?: string;
  }
  namespace Error {
    export interface Errback {
      message?: string;
    }
  }
}