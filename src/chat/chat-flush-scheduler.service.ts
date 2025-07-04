import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ChatBufferService } from './chat-buffer.service';
import { ChatService } from './chat.service';

@Injectable()
export class ChatFlushScheduler implements OnModuleInit {
  private logger = new Logger(ChatFlushScheduler.name);
  private readonly FLUSH_INTERVAL = 10000;

  constructor(
    private readonly chatBufferService: ChatBufferService,
    private readonly chatService: ChatService
  ) {}

  onModuleInit() {
    if (process.env.INSTANCE_ID === 'chat-1') {
      setInterval(() => this.tryFlush(), this.FLUSH_INTERVAL);
    }
  }

  async tryFlush() {
    if (this.chatBufferService.getTotalCount() === 0) {
      return;
    }

    const messagesByRoom = this.chatBufferService.flushAll();
    for (const [roomId, messages] of Object.entries(messagesByRoom)) {
      await this.chatService.bulkInsert(messages);
      this.logger.debug(`[FLUSH] Inserted ${messages.length} messages for room ${roomId}`);
    }
  }
}
