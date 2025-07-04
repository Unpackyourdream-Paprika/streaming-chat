import { ChatDto } from '@/chat/dto/request/chat.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatBufferService {
  private buffer: Record<string, Array<ChatDto>> = {};

  addMessage(roomId: string, chat: ChatDto) {
    if (!this.buffer[roomId]) {
      this.buffer[roomId] = [];
    }
    this.buffer[roomId].push(chat);
  }

  flushRoom(roomId: string): ChatDto[] {
    const messages = this.buffer[roomId] ?? [];
    this.buffer[roomId] = [];
    return messages;
  }

  flushAll(): Record<string, ChatDto[]> {
    const copied = { ...this.buffer };
    this.buffer = {};
    return copied;
  }

  getBufferLength(roomId: string): number {
    return this.buffer[roomId]?.length ?? 0;
  }

  getTotalCount(): number {
    return Object.values(this.buffer).reduce((acc, msgs) => acc + msgs.length, 0);
  }

  clearAll(): void {
    this.buffer = {};
  }

  clear(roomId: string): void {
    this.buffer[roomId] = [];
  }
}
