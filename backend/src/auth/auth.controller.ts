import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@ApiTags('认证')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: '用户登录' })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    return this.authService.login(user);
  }

  @Post('register')
  @ApiOperation({ summary: '用户注册' })
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(
      registerDto.email,
      registerDto.password,
      registerDto.nickname,
      registerDto.role,
    );
    return {
      message: '注册成功',
      user,
    };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取当前用户信息' })
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user.userId);
  }
}
