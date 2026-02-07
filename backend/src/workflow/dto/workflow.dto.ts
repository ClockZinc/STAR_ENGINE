import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AssetWorkflowStatus } from '@prisma/client';

export class TransitionDto {
  @ApiProperty({ enum: AssetWorkflowStatus, description: '目标状态' })
  @IsEnum(AssetWorkflowStatus)
  targetStatus: AssetWorkflowStatus;

  @ApiProperty({ required: false, description: '流转原因' })
  @IsString()
  @IsOptional()
  reason?: string;
}

export class FreezeDto {
  @ApiProperty({ description: '熔断/解冻原因' })
  @IsString()
  reason: string;
}
