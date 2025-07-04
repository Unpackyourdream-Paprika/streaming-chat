import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class CustomJwtService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  sign(
    userId: number,
    isAdmin: boolean,
    expiresIn: string = undefined,
  ): string {
    return this.jwtService.sign(
      { userId, isAdmin },
      {
        expiresIn:
          expiresIn ??
          this.configService.get<string>('JWT_ACCESS_EXPIRES_IN', '1h'),
      },
    );
  }

  verifyToken(token: string): JwtPayload {
    return this.jwtService.verify(token);
  }
}
