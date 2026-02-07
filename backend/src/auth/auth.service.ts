import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { SystemRole, UserStatus } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    if (user.status === UserStatus.SUSPENDED) {
      throw new UnauthorizedException('账户已被禁用');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('密码错误');
    }

    // 更新最后登录时间
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const { password: _, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        avatar: user.avatar,
        role: user.role,
      },
    };
  }

  async register(email: string, password: string, nickname: string, role: SystemRole = SystemRole.VOLUNTEER) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new UnauthorizedException('该邮箱已被注册');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nickname,
        role,
        status: UserStatus.ACTIVE,
      },
    });

    const { password: _, ...result } = user;
    return result;
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        nickname: true,
        avatar: true,
        role: true,
        status: true,
        organization: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    return user;
  }
}
