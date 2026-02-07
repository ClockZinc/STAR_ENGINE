import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LicensesService } from './licenses.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateLicenseDto, UpdateLicenseDto, SignLicenseDto } from './dto/license.dto';
import { LicenseStatus } from '@prisma/client';

@ApiTags('授权合同')
@Controller('licenses')
export class LicensesController {
  constructor(private licensesService: LicensesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取授权合同列表' })
  async findAll(
    @Query('status') status?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const skip = (page - 1) * limit;
    return this.licensesService.findAll({
      skip,
      take: +limit,
      where: status ? { status: status as LicenseStatus } : undefined,
    });
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取授权统计' })
  async getStats() {
    return this.licensesService.getStats();
  }

  @Get('expiring')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取即将到期的合同' })
  async getExpiring(@Query('days') days?: string) {
    return this.licensesService.getExpiringLicenses(
      days ? parseInt(days) : 30,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取授权合同详情' })
  async findOne(@Param('id') id: string) {
    return this.licensesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建授权合同' })
  async create(@Body() dto: CreateLicenseDto, @Request() req) {
    return this.licensesService.create({
      ...dto,
      licensor: { connect: { id: req.user.userId } },
      asset: { connect: { id: dto.assetId } },
    });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新授权合同' })
  async update(@Param('id') id: string, @Body() dto: UpdateLicenseDto) {
    return this.licensesService.update(id, dto);
  }

  @Post(':id/sign')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '签署授权合同' })
  async sign(@Param('id') id: string, @Request() req) {
    return this.licensesService.signLicense(id, req.user.userId);
  }

  @Post(':id/freeze')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '熔断授权合同（品牌防火墙）' })
  async freeze(@Param('id') id: string, @Body() dto: { reason: string }) {
    return this.licensesService.freezeLicense(id, dto.reason);
  }

  @Post(':id/unfreeze')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '解冻授权合同' })
  async unfreeze(@Param('id') id: string) {
    return this.licensesService.unfreezeLicense(id);
  }

  @Post(':id/terminate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '终止授权合同' })
  async terminate(@Param('id') id: string, @Body() dto: { reason: string }) {
    return this.licensesService.terminateLicense(id, dto.reason);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除授权合同' })
  async remove(@Param('id') id: string) {
    return this.licensesService.remove(id);
  }
}
