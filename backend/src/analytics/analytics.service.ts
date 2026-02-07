import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AssetWorkflowStatus, TransactionType, TransactionStatus } from '@prisma/client';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  // 获取仪表盘概览数据
  async getDashboardOverview() {
    const [
      totalAssets,
      totalUsers,
      totalLicenses,
      totalTransactions,
      activeLicenses,
      pendingAssets,
    ] = await Promise.all([
      this.prisma.iPAsset.count(),
      this.prisma.user.count(),
      this.prisma.license.count(),
      this.prisma.transaction.count(),
      this.prisma.license.count({ where: { status: 'ACTIVE' } }),
      this.prisma.iPAsset.count({
        where: {
          status: {
            in: [AssetWorkflowStatus.RAW, AssetWorkflowStatus.ENHANCED],
          },
        },
      }),
    ]);

    // 计算总收益
    const revenue = await this.prisma.transaction.aggregate({
      where: {
        status: TransactionStatus.COMPLETED,
        type: {
          in: [TransactionType.LICENSE_FEE, TransactionType.ROYALTY],
        },
      },
      _sum: {
        amount: true,
      },
    });

    return {
      overview: {
        totalAssets,
        totalUsers,
        totalLicenses,
        totalTransactions,
        activeLicenses,
        pendingAssets,
        totalRevenue: revenue._sum.amount || 0,
      },
    };
  }

  // 资产状态分布
  async getAssetStatusDistribution() {
    const distribution = await this.prisma.iPAsset.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    });

    return distribution.map(item => ({
      status: item.status,
      count: item._count.status,
    }));
  }

  // 月度资产创建趋势
  async getAssetCreationTrend(months: number = 6) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const assets = await this.prisma.iPAsset.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        createdAt: true,
      },
    });

    // 按月份分组
    const trend = new Map<string, number>();
    for (let i = 0; i < months; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      trend.set(key, 0);
    }

    assets.forEach(asset => {
      const date = new Date(asset.createdAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (trend.has(key)) {
        trend.set(key, trend.get(key) + 1);
      }
    });

    return Array.from(trend.entries())
      .map(([month, count]) => ({ month, count }))
      .reverse();
  }

  // 收益统计
  async getRevenueStats() {
    const stats = await this.prisma.transaction.groupBy({
      by: ['type'],
      where: {
        status: TransactionStatus.COMPLETED,
      },
      _sum: {
        amount: true,
      },
      _count: {
        type: true,
      },
    });

    return stats.map(item => ({
      type: item.type,
      totalAmount: item._sum.amount || 0,
      count: item._count.type,
    }));
  }

  // 创作者排行榜
  async getTopCreators(limit: number = 10) {
    const creators = await this.prisma.user.findMany({
      where: {
        role: 'ADMIN', // 简化处理，实际应该按创作者身份
      },
      take: limit,
      include: {
        createdAssets: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    return creators.map(creator => ({
      id: creator.id,
      nickname: creator.nickname,
      avatar: creator.avatar,
      totalAssets: creator.createdAssets.length,
      activeAssets: creator.createdAssets.filter(a => a.status === AssetWorkflowStatus.DISTRIBUTING).length,
    }));
  }

  // 商会订阅统计
  async getPartnerStats() {
    const stats = await this.prisma.partnerSubscription.groupBy({
      by: ['planType', 'status'],
      _count: {
        id: true,
      },
      _sum: {
        mrr: true,
      },
    });

    const totalMrr = await this.prisma.partnerSubscription.aggregate({
      where: { status: 'ACTIVE' },
      _sum: { mrr: true },
    });

    return {
      byPlan: stats,
      totalMrr: totalMrr._sum.mrr || 0,
    };
  }

  // 社会影响指标（模拟 dignity fund 计算）
  async getSocialImpactMetrics() {
    const familySupportHours = 1250; // 可以从实际数据计算
    const royaltyCollectionRate = 85.5;
    const socialPerceptionShift = 82;
    const exposureQualityScore = 91;

    const totalContributions = await this.prisma.physicalItem.aggregate({
      _sum: {
        contribution: true,
      },
    });

    return {
      familySupportHours,
      royaltyCollectionRate,
      socialPerceptionShift,
      exposureQualityScore,
      dignityFundTotal: totalContributions._sum.contribution || 50000,
    };
  }

  // 全量报表（供指挥官使用）
  async getFullReport() {
    const [
      overview,
      assetDistribution,
      assetTrend,
      revenueStats,
      partnerStats,
      socialImpact,
    ] = await Promise.all([
      this.getDashboardOverview(),
      this.getAssetStatusDistribution(),
      this.getAssetCreationTrend(6),
      this.getRevenueStats(),
      this.getPartnerStats(),
      this.getSocialImpactMetrics(),
    ]);

    return {
      generatedAt: new Date().toISOString(),
      overview: overview.overview,
      assetDistribution,
      assetTrend,
      revenueStats,
      partnerStats,
      socialImpact,
    };
  }
}
