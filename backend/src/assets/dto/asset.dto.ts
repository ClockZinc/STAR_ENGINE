import { IsString, IsOptional, IsEnum, IsArray, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AssetType, AssetWorkflowStatus, CopyrightOwner } from '@prisma/client';

export class CreateAssetDto {
  @ApiProperty({ example: '深夜的呼吸', description: '作品标题' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: '这是一幅充满深蓝色调的作品...', description: '作品描述' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: AssetType, default: AssetType.IMAGE, description: '资产类型' })
  @IsEnum(AssetType)
  type: AssetType;

  @ApiProperty({ example: 'https://example.com/image.jpg', description: '原始文件URL' })
  @IsString()
  originalUrl: string;

  @ApiPropertyOptional({ enum: CopyrightOwner, default: CopyrightOwner.CREATOR })
  @IsEnum(CopyrightOwner)
  @IsOptional()
  copyrightOwner?: CopyrightOwner;
}

export class UpdateAssetDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'https://example.com/enhanced.jpg' })
  @IsString()
  @IsOptional()
  enhancedUrl?: string;

  @ApiPropertyOptional({ example: 'https://example.com/model.glb' })
  @IsString()
  @IsOptional()
  threeDModelUrl?: string;

  @ApiPropertyOptional({ example: ['蓝色', '宇宙', '孤独'] })
  @IsArray()
  @IsOptional()
  emotionTags?: string[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  artStory?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  dciCode?: string;
}

export class UpdateStatusDto {
  @ApiProperty({ enum: AssetWorkflowStatus, description: '新状态' })
  @IsEnum(AssetWorkflowStatus)
  status: AssetWorkflowStatus;
}
