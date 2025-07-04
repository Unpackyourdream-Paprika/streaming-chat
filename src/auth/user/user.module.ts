import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomJwtModule } from '@/global/jwt/jwt.module';
import { UserEntity } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), CustomJwtModule],
  controllers: [],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
