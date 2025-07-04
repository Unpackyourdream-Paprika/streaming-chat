import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RedisService } from '@/global/redis/redis.service';
import { Logger } from '@nestjs/common';
import { ChatBufferService } from './chat-buffer.service';
import { CustomJwtService } from '../global/jwt/jwt.service';

@WebSocketGateway({ cors: true })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger(ChatGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly redisService: RedisService,
    private readonly chatBufferService: ChatBufferService,
    private readonly customJwtService: CustomJwtService,
  ) {}

  async afterInit() {
    let attempts = 0;
    while (!this.redisService['subscriber'] && attempts < 10) {
      await new Promise((res) => setTimeout(res, 100));
      attempts++;
    }

    this.redisService.subscribe('chat', (raw: string) => {
      const parsed = JSON.parse(raw);
      const { roomId, message, userId, name, email } = parsed;

      this.server.to(roomId).emit('chat', {
        message,
        userId,
        name,
        email,
      });
    });
  }

  /**
  const socket = io('ws://localhost:5999', {
    auth: {
      token: `Bearer ${accessToken}`,
    },
    query: {
      roomId: '123',
    },
  });
   */
  async handleConnection(client: Socket) {
    const token = client.handshake.auth?.token?.replace('Bearer ', '');
    const roomId = client.handshake.query.roomId as string;

    try {
      const decoded: any = this.customJwtService.verifyToken(token);
      const userId = decoded.userId;

      client.data.userId = userId;

      client.join(roomId);
      await this.redisService.sadd(`room:${roomId}:users`, userId);
    } catch (e) {
      this.logger.error(e);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const roomId = client.data.roomId;
    const userId = client.data.userId;

    if (roomId && userId) {
      await this.redisService.srem(`room:${roomId}:users`, userId);
    }
  }

  @SubscribeMessage('chat')
  async handleMessage(client: Socket, payload: { message: string }) {
    const roomId = client.data.roomId;
    const userId = client.data.userId;
    const name = client.data.name;
    const email = client.data.email;

    const wrapped = JSON.stringify({
      roomId,
      userId,
      name,
      email,
      message: payload.message,
    });

    await this.redisService.publish('chat', wrapped);

    if (process.env.INSTANCE_ID == 'chat-1') {
      this.chatBufferService.addMessage(roomId, {
        roomId,
        userId,
        message: payload.message,
        createdAt: new Date(),
      });
    }
  }
}
