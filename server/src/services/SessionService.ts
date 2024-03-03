import { WebSocket } from 'ws';
import { CanvasData } from '../models/CanvasData';

export class SessionService {
  private canvasData: CanvasData;
  private connections: WebSocket[] = [];

  constructor() {
    this.canvasData = new CanvasData();
  }

  public addConnection(ws: WebSocket) {
    this.connections.push(ws);
  }

  public closeConnection(ws: WebSocket) {
    let index = this.connections.indexOf(ws);
    this.connections.splice(index, 1);
    if (this.connections.length < 1) {
      this.canvasData.clear();
    }
  }

  public restoreClientData(ws: WebSocket) {
    this.canvasData.getData().forEach((data: string) => ws.send(data + "\n\n"));
  }

  public broadcastData(message: string, ws: WebSocket) {
    this.connections.forEach((connection: WebSocket) => {
      if (connection !== ws && connection.readyState === WebSocket.OPEN) {
        connection.send(message + "\n\n");
      }
    });
    this.canvasData.addData(message);
  }
}