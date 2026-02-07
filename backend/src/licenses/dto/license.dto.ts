import { IsString, IsEnum, IsNumber, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LicenseType, LicenseStatus } from '@prisma/client';

export class CreateLicenseDto {
  @ApiProperty({ description: '资产ID' })
  @IsString()
  assetId: string;

  @ApiProperty({ enum: LicenseType, description: '授权类型' })
  @IsEnum(LicenseType)
  licenseType: LicenseType;

  @ApiProperty({ description: '被授权方名称' })
  @IsString()
  licenseeName: string;

  @ApiPropertyOptional({ description: '联系人' })
  @IsString()
  @IsOptional()
  licenseeContact?: string;

  @ApiPropertyOptional({ description: '联系邮箱' })
  @IsString()
  @IsOptional()
  licenseeEmail?: string;

  @ApiProperty({ description: '入门费' })
  @IsNumber()
  entryFee: number;

  @ApiProperty({ description: '分成比例(%)' })
  @IsNumber()
  royaltyRate: number;

  @ApiPropertyOptional({ description: '最低保证金' })
  @IsNumber()
  @IsOptional()
  minGuarantee?: number;

  @ApiProperty({ description: '生效日期' })
  @IsDateString()
  effectiveDate: string;

  @ApiProperty({ description: '到期日期' })
  @IsDateString()
  expiryDate: string;

  @ApiPropertyOptional({ description: '地域范围' })
  @IsString()
  @IsOptional()
  territory?: string;

  @ApiPropertyOptional({ description: '使用领域' })
  @IsString()
  @IsOptional()
  usageField?: string;

  @ApiPropertyOptional({ description: '使用数量限制' })
  @IsNumber()
  @IsOptional()
  usageLimit?: number;
}

export class UpdateLicenseDto {
  @ApiPropertyOptional({ description: '被授权方名称' })
  @IsString()
  @IsOptional()
  licenseeName?: string;

  @ApiPropertyOptional({ description: '入门费' })
  @IsNumber()
  @IsOptional()
  entryFee?: number;

  @ApiPropertyOptional({ description: '分成比例(%)' })
  @IsNumber()
  @IsOptional()
  royaltyRate?: number;

  @ApiPropertyOptional({ description: '到期日期' })
  @IsDateString()
  @IsOptional()
  expiryDate?: string;
}

export class SignLicenseDto {
  @ApiProperty({ description: '合同URL' })
  @IsString()
  contractUrl: string;
}
