import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedisService } from '../global/redis/redis.service';
import { RoomEntity } from './entities/room.entity';

@Injectable()
export class RoomService {
  private logger = new Logger(RoomService.name);
  constructor(
    private readonly redisService: RedisService,

    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
  ) {}
}
