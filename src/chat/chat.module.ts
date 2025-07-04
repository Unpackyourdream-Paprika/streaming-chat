import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatLogEntity } from './entities/chat-log.entity';
import { ChatBufferService } from './chat-buffer.service';
import { ChatGateway } from './chat.gateway';
import { ChatFlushScheduler } from './chat-flush-scheduler.service';
import { RedisModule } from '@/global/redis/redis.module';
import { CustomJwtModule } from '@/global/jwt/jwt.module';

@Module({
  imports: [TypeOrmModule.forFeature([ChatLogEntity]), RedisModule, CustomJwtModule],
  controllers: [ChatController],
  providers: [ChatService, ChatBufferService, ChatGateway, ChatFlushScheduler],
  exports: [ChatService, ChatBufferService],
})
export class ChatModule {}
