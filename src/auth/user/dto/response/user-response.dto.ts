import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsString } from 'class-validator';
import { USER_ROLE } from '../../entities/user.entity';

export class UserResponse {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  nickname: string;

  @IsEnum(USER_ROLE)
  role: USER_ROLE;

  @IsString()
  description: string;

  @IsString()
  imgUrl: string;

  @IsString()
  location: string;

  @IsString()
  status: boolean;

  @IsDate()
  @Type(() => Date)
  createdAt: Date;
}
