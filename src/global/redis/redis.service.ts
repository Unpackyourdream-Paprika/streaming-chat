import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit
} from '@nestjs/common';
import Redis, { Redis as RedisClient } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private publisher: RedisClient; // Sender
  private subscriber: RedisClient; // Receiver

  constructor() {}

  async onModuleInit() {
    this.publisher = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    });

    this.subscriber = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    });

    await Promise.all([
      new Promise<void>((resolve) => this.publisher.once('ready', resolve)),
      new Promise<void>((resolve) => this.subscriber.once('ready', resolve)),
    ]);
  }

  publish(channel: string, message: string) {
    return this.publisher.publish(channel, message);
  }

  subscribe(channel: string, callback: (message: string) => void) {
    if (!this.subscriber) {
      throw new Error('Redis subscriber is not initialized yet.');
    }

    this.subscriber.subscribe(channel, (err, count) => {
      if (err) {
        throw new Error(
          `Failed to subscribe to channel ${channel}: ${err.message}`,
        );
      }
    });

    this.subscriber.on('message', (ch, message) => {
      if (ch === channel) {
        callback(message);
      }
    });
  }

  async sadd(key: string, data: string): Promise<number> {
    return this.publisher.sadd(key, data);
  }

  async scard(key: string): Promise<number> {
    return this.publisher.scard(key);
  }

  async srem(key: string, data: string) {
    return this.publisher.srem(key, data);
  }

  onModuleDestroy() {
    this.publisher?.disconnect();
    this.subscriber?.disconnect();
  }
}
