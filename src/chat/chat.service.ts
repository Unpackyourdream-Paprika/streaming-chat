import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ChatLogEntity } from './entities/chat-log.entity';
import { ChatDto } from './dto/request/chat.dto';

@Injectable()
export class ChatService {
  private logger = new Logger(ChatService.name);

  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(ChatLogEntity)
    private readonly chatLogRepository: Repository<ChatLogEntity>
  ) {}

  async bulkInsert(chats: ChatDto[]): Promise<boolean> {
    try {
      if (chats.length == 0) return;

      const entities = chats.map((chat) =>
        this.chatLogRepository.create({
          roomId: chat.roomId,
          userId: chat.userId,
          message: chat.message,
          created_at: chat.createdAt
        })
      );

      await this.chatLogRepository.save(entities);
      this.logger.log(`💾 Inserted ${entities.length} chat logs`);
      return true;
    } catch (error) {
      this.logger.error('❌ Failed to insert chat logs', error.stack);
      return false;
    }
  }
}
