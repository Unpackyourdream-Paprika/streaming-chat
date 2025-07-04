import { UserResponse } from './dto/response/user-response.dto';
import { UserEntity } from './entities/user.entity';

export class UserMapper {
  public static mapToResponseData(userEntity: UserEntity): UserResponse | undefined {
    return {
      id: userEntity.id,
      name: userEntity.name,
      nickname: userEntity.nickname,
      role: userEntity.role,
      description: userEntity.description,
      imgUrl: userEntity.img_url,
      location: userEntity.location,
      status: userEntity.status,
      createdAt: userEntity.created_at
    };
  }
}
