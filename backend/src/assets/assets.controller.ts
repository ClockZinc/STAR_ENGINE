import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AssetsService } from './assets.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateAssetDto, UpdateAssetDto, UpdateStatusDto } from './dto/asset.dto';
import { AssetWorkflowStatus } from '@prisma/client';

@ApiTags('IP资产')
@Controller('assets')
export class AssetsController {
  constructor(private assetsService: AssetsService) {}

  @Get()
  @ApiOperation({ summary: '获取资产列表' })
  async findAll(@Query('status') status?: AssetWorkflowStatus, @Query('page') page = 1, @Query('limit') limit = 10) {
    const skip = (page - 1) * limit;
    return this.assetsService.findAll({
      skip,
      take: +limit,
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get('stats')
  @ApiOperation({ summary: '获取资产统计' })
  async getStats() {
    return this.assetsService.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取资产详情' })
  async findOne(@Param('id') id: string) {
    return this.assetsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建资产' })
  async create(@Body() createAssetDto: CreateAssetDto, @Request() req) {
    return this.assetsService.create({
      ...createAssetDto,
      creator: { connect: { id: req.user.userId } },
    });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新资产' })
  async update(@Param('id') id: string, @Body() updateAssetDto: UpdateAssetDto) {
    return this.assetsService.update(id, updateAssetDto);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新资产状态' })
  async updateStatus(@Param('id') id: string, @Body() statusDto: UpdateStatusDto) {
    return this.assetsService.updateStatus(id, statusDto.status);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除资产' })
  async remove(@Param('id') id: string) {
    return this.assetsService.remove(id);
  }
}
