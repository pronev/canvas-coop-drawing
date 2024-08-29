import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import SessionRepository from './services/SessionRepository';

const wss = new WebSocketServer({ port: 4000 });
const sessionRepository = new SessionRepository();

wss.on('connection', (ws: WebSocket, request: IncomingMessage) => {

  const id: string = request.url;
  sessionRepository.save(id);
  const session = sessionRepository.findById(id);
  session.addConnection(ws);
  session.restoreClientData(ws);
  
  ws.on('message', (message: string) => {
    session.broadcastData(message, ws);
  });

  ws.on('close', () => {
    session.closeConnection(ws);
  });

  ws.on('error', console.error);
});