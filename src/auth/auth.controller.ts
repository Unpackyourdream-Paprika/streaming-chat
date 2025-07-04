import { CommonResponse } from '@/util/api.response';
import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/request/login.dto';
import { SignupDto } from './dto/request/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    // private readonly redisService: RedisService
  ) {}

  @Post('/signup')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: multer.memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
        if (!allowedTypes.includes(file.mimetype)) {
          return cb(new Error('Invalid file type'), false);
        }
        cb(null, true);
      },
    }),
  )
  async signup(
    @Body() signupDto: SignupDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const accessToken = await this.authService.signup(signupDto, image);

    return CommonResponse.ok('Signup Success.', { accessToken });
  }

  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    const accessToken = await this.authService.login(loginDto);

    return CommonResponse.ok('Login Success.', { accessToken });
  }
}
