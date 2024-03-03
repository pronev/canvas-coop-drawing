import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import Sessions from './services/Sessions';

const wss = new WebSocketServer({ port: 4000 });

wss.on('connection', function(ws: WebSocket, request: IncomingMessage) {

  const id: string = request.url;
  const session = Sessions.getInstance().add(id);

  session.addConnection(ws);
  session.restoreClientData(ws);
  
  ws.on('message', function(message: string) {
    session.broadcastData(message, ws);
  });

  ws.on('close', () => {
    session.closeConnection(ws);
  });

  ws.on('error', console.error);
});