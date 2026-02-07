import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AssetWorkflowStatus, AuditLog } from '@prisma/client';

// 工作流状态转换规则
const WORKFLOW_TRANSITIONS: Record<AssetWorkflowStatus, AssetWorkflowStatus[]> = {
  [AssetWorkflowStatus.RAW]: [AssetWorkflowStatus.ENHANCED],
  [AssetWorkflowStatus.ENHANCED]: [AssetWorkflowStatus.THREE_D_GEN, AssetWorkflowStatus.ALGORITHMIC],
  [AssetWorkflowStatus.THREE_D_GEN]: [AssetWorkflowStatus.THREE_D_DONE],
  [AssetWorkflowStatus.THREE_D_DONE]: [AssetWorkflowStatus.ALGORITHMIC, AssetWorkflowStatus.LEGAL_LOCKED],
  [AssetWorkflowStatus.ALGORITHMIC]: [AssetWorkflowStatus.LEGAL_LOCKED],
  [AssetWorkflowStatus.LEGAL_LOCKED]: [AssetWorkflowStatus.CONTRACTED],
  [AssetWorkflowStatus.CONTRACTED]: [AssetWorkflowStatus.DISTRIBUTING],
  [AssetWorkflowStatus.DISTRIBUTING]: [AssetWorkflowStatus.FROZEN, AssetWorkflowStatus.ARCHIVED],
  [AssetWorkflowStatus.FROZEN]: [AssetWorkflowStatus.DISTRIBUTING, AssetWorkflowStatus.ARCHIVED],
  [AssetWorkflowStatus.ARCHIVED]: [],
};

// 状态流转权限
const STATUS_PERMISSIONS: Record<AssetWorkflowStatus, string[]> = {
  [AssetWorkflowStatus.RAW]: ['VOLUNTEER', 'ADMIN'],
  [AssetWorkflowStatus.ENHANCED]: ['ADMIN'],
  [AssetWorkflowStatus.THREE_D_GEN]: ['ADMIN'],
  [AssetWorkflowStatus.THREE_D_DONE]: ['ADMIN'],
  [AssetWorkflowStatus.ALGORITHMIC]: ['ADMIN'],
  [AssetWorkflowStatus.LEGAL_LOCKED]: ['LAWYER', 'ADMIN'],
  [AssetWorkflowStatus.CONTRACTED]: ['MERCHANT', 'ADMIN'],
  [AssetWorkflowStatus.DISTRIBUTING]: ['MERCHANT', 'ADMIN'],
  [AssetWorkflowStatus.FROZEN]: ['ADMIN'],
  [AssetWorkflowStatus.ARCHIVED]: ['ADMIN'],
};

export interface TransitionResult {
  success: boolean;
  oldStatus: AssetWorkflowStatus;
  newStatus: AssetWorkflowStatus;
  auditLog?: AuditLog;
  message?: string;
}

@Injectable()
export class WorkflowService {
  constructor(private prisma: PrismaService) {}

  // 获取资产当前工作流状态
  async getAssetStatus(assetId: string) {
    const asset = await this.prisma.iPAsset.findUnique({
      where: { id: assetId },
      select: {
        id: true,
        title: true,
        status: true,
        creatorId: true,
        legalAuditorId: true,
      },
    });

    if (!asset) {
      throw new NotFoundException('资产不存在');
    }

    const availableTransitions = WORKFLOW_TRANSITIONS[asset.status] || [];

    return {
      assetId: asset.id,
      title: asset.title,
      currentStatus: asset.status,
      availableTransitions,
      canTransition: availableTransitions.length > 0,
    };
  }

  // 执行状态流转
  async transition(
    assetId: string,
    targetStatus: AssetWorkflowStatus,
    userId: string,
    userRole: string,
    reason?: string,
  ): Promise<TransitionResult> {
    const asset = await this.prisma.iPAsset.findUnique({
      where: { id: assetId },
    });

    if (!asset) {
      throw new NotFoundException('资产不存在');
    }

    const currentStatus = asset.status;

    // 检查是否允许该流转
    const allowedTransitions = WORKFLOW_TRANSITIONS[currentStatus] || [];
    if (!allowedTransitions.includes(targetStatus)) {
      return {
        success: false,
        oldStatus: currentStatus,
        newStatus: targetStatus,
        message: `不允许从 ${currentStatus} 流转到 ${targetStatus}`,
      };
    }

    // 检查权限
    const allowedRoles = STATUS_PERMISSIONS[targetStatus] || [];
    if (!allowedRoles.includes(userRole) && userRole !== 'ADMIN') {
      return {
        success: false,
        oldStatus: currentStatus,
        newStatus: targetStatus,
        message: `当前角色 ${userRole} 无权执行此操作`,
      };
    }

    // 执行流转
    const updated = await this.prisma.iPAsset.update({
      where: { id: assetId },
      data: {
        status: targetStatus,
        legalLockedAt: targetStatus === AssetWorkflowStatus.LEGAL_LOCKED ? new Date() : asset.legalLockedAt,
        legalAuditorId: targetStatus === AssetWorkflowStatus.LEGAL_LOCKED ? userId : asset.legalAuditorId,
      },
    });

    // 创建审计日志
    const auditLog = await this.prisma.auditLog.create({
      data: {
        assetId,
        action: 'STATUS_TRANSITION',
        actorId: userId,
        actorRole: userRole,
        oldValue: currentStatus,
        newValue: targetStatus,
        reason,
      },
    });

    return {
      success: true,
      oldStatus: currentStatus,
      newStatus: targetStatus,
      auditLog,
    };
  }

  // 熔断资产（品牌防火墙）
  async freezeAsset(assetId: string, userId: string, reason: string): Promise<TransitionResult> {
    return this.transition(
      assetId,
      AssetWorkflowStatus.FROZEN,
      userId,
      'ADMIN',
      `品牌防火墙熔断: ${reason}`,
    );
  }

  // 解冻资产
  async unfreezeAsset(assetId: string, userId: string, reason: string): Promise<TransitionResult> {
    const asset = await this.prisma.iPAsset.findUnique({
      where: { id: assetId },
    });

    if (!asset || asset.status !== AssetWorkflowStatus.FROZEN) {
      throw new BadRequestException('资产未处于冻结状态');
    }

    // 解冻后回到分发状态
    return this.transition(
      assetId,
      AssetWorkflowStatus.DISTRIBUTING,
      userId,
      'ADMIN',
      `解除熔断: ${reason}`,
    );
  }

  // 获取资产审计历史
  async getAuditHistory(assetId: string) {
    return this.prisma.auditLog.findMany({
      where: { assetId },
      orderBy: { createdAt: 'desc' },
      include: {
        asset: {
          select: { title: true },
        },
      },
    });
  }

  // 获取工作流统计
  async getWorkflowStats() {
    const stats = await this.prisma.iPAsset.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    });

    const total = await this.prisma.iPAsset.count();

    return {
      total,
      byStatus: stats.reduce((acc, item) => {
        acc[item.status] = item._count.status;
        return acc;
      }, {} as Record<string, number>),
    };
  }

  // 批量流转（用于自动化流程）
  async batchTransition(
    assetIds: string[],
    targetStatus: AssetWorkflowStatus,
    userId: string,
    userRole: string,
  ) {
    const results = await Promise.all(
      assetIds.map(id =>
        this.transition(id, targetStatus, userId, userRole).catch(err => ({
          assetId: id,
          success: false,
          error: err.message,
        })),
      ),
    );

    return {
      total: assetIds.length,
      success: results.filter((r: any) => r.success).length,
      failed: results.filter((r: any) => !r.success).length,
      details: results,
    };
  }
}
