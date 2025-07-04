import { Controller } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { RedisService } from '../global/redis/redis.service';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
    private readonly authService: AuthService,
    private readonly redisService: RedisService,
  ) {}
}
