import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AnalyticsService } from './analytics.service';

@ApiTags('数据分析')
@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '仪表盘概览数据' })
  async getDashboard() {
    return this.analyticsService.getDashboardOverview();
  }

  @Get('assets/distribution')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '资产状态分布' })
  async getAssetDistribution() {
    return this.analyticsService.getAssetStatusDistribution();
  }

  @Get('assets/trend')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '资产创建趋势' })
  async getAssetTrend(@Query('months') months?: string) {
    return this.analyticsService.getAssetCreationTrend(
      months ? parseInt(months) : 6,
    );
  }

  @Get('revenue')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '收益统计' })
  async getRevenue() {
    return this.analyticsService.getRevenueStats();
  }

  @Get('creators/top')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '创作者排行榜' })
  async getTopCreators(@Query('limit') limit?: string) {
    return this.analyticsService.getTopCreators(
      limit ? parseInt(limit) : 10,
    );
  }

  @Get('partners/stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '商会订阅统计' })
  async getPartnerStats() {
    return this.analyticsService.getPartnerStats();
  }

  @Get('social-impact')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '社会影响指标' })
  async getSocialImpact() {
    return this.analyticsService.getSocialImpactMetrics();
  }

  @Get('full-report')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '全量报表（指挥官专用）' })
  async getFullReport() {
    return this.analyticsService.getFullReport();
  }
}
