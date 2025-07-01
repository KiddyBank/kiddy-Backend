import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';


@WebSocketGateway({
  cors: {
    origin: '*', 
  },
})
export class AllowanceGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private clients = new Map<string, string>(); // userId -> socketId

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.clients.set(userId, client.id);
      console.log(`user ${userId} connected`);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = [...this.clients.entries()].find(([, id]) => id === client.id)?.[0];
    if (userId) {
      this.clients.delete(userId);
      console.log(`user ${userId} disconnected`);
    }
  }

  sendAllowanceToUser(userId: string, data: any) {
    const socketId = this.clients.get(userId);
    if (socketId) {
      this.server.to(socketId).emit('allowance', data);
    }
  }
}
