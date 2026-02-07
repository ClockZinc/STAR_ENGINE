import { IsString, IsEnum, IsNumber, IsOptional, IsJSON } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionType } from '@prisma/client';

export class CreateTransactionDto {
  @ApiProperty({ enum: TransactionType, description: '交易类型' })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({ description: '金额' })
  @IsNumber()
  amount: number;

  @ApiPropertyOptional({ description: '货币', default: 'CNY' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiPropertyOptional({ description: '付款方ID' })
  @IsString()
  @IsOptional()
  payerId?: string;

  @ApiPropertyOptional({ description: '授权合同ID' })
  @IsString()
  @IsOptional()
  licenseId?: string;

  @ApiPropertyOptional({ description: '资产ID' })
  @IsString()
  @IsOptional()
  assetId?: string;

  @ApiPropertyOptional({ description: '描述' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: '收款方类型' })
  @IsString()
  @IsOptional()
  payeeType?: string;

  @ApiPropertyOptional({ description: '收款方ID' })
  @IsString()
  @IsOptional()
  payeeId?: string;

  @ApiPropertyOptional({ description: '额外元数据' })
  @IsOptional()
  metadata?: any;
}

export class CompletePaymentDto {
  @ApiProperty({ description: '支付方式' })
  @IsString()
  paymentMethod: string;

  @ApiProperty({ description: '第三方支付单号' })
  @IsString()
  paymentRef: string;
}
