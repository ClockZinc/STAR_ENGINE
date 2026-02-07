import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SystemRole } from '@prisma/client';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com', description: '邮箱地址' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: '密码' })
  @IsString()
  @MinLength(6)
  password: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com', description: '邮箱地址' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: '密码（至少6位）' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: '张三', description: '昵称' })
  @IsString()
  nickname: string;

  @ApiProperty({ enum: SystemRole, default: SystemRole.VOLUNTEER, description: '用户角色' })
  @IsEnum(SystemRole)
  @IsOptional()
  role?: SystemRole;
}
