import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Authentication')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: RegisterDto })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginData: LoginDto) {
    try {
      const user = await this.authService.validateUser(loginData);
      if (!user) {
        throw new HttpException(
          { status: HttpStatus.UNAUTHORIZED, message: 'Invalid credentials' },
          HttpStatus.UNAUTHORIZED,
        );
      }
      return this.authService.login(user);
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          message: error.message,
        },
        error.status,
      );
    }
  }
}
