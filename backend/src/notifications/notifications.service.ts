import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

// 本地定义通知类型枚举
type NotificationType = 'SYSTEM' | 'WORKFLOW' | 'LICENSE' | 'TRANSACTION' | 'MESSAGE';

// 创建自定义枚举，因为 Prisma schema 中可能没有定义
enum NotificationStatus {
  UNREAD = 'UNREAD',
  READ = 'READ',
  ARCHIVED = 'ARCHIVED'
}

export interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  content: string;
  relatedId?: string;
  relatedType?: string;
}

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, status?: NotificationStatus) {
    return this.prisma.$queryRaw`
      SELECT * FROM notifications 
      WHERE "userId" = ${userId}
      ${status ? Prisma.raw(`AND status = '${status}'`) : Prisma.empty}
      ORDER BY "createdAt" DESC
    `;
  }

  async findOne(id: string, userId: string) {
    const notifications = await this.prisma.$queryRaw`
      SELECT * FROM notifications 
      WHERE id = ${id} AND "userId" = ${userId}
    `;
    return (notifications as any[])[0];
  }

  async create(input: CreateNotificationInput) {
    const { userId, type, title, content, relatedId, relatedType } = input;
    
    const result = await this.prisma.$queryRaw`
      INSERT INTO notifications (id, "userId", type, title, content, status, "relatedId", "relatedType", "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), ${userId}, ${type}, ${title}, ${content}, 'UNREAD', ${relatedId || null}, ${relatedType || null}, NOW(), NOW())
      RETURNING *
    `;
    return (result as any[])[0];
  }

  async markAsRead(id: string, userId: string) {
    const result = await this.prisma.$queryRaw`
      UPDATE notifications 
      SET status = 'READ', "readAt" = NOW(), "updatedAt" = NOW()
      WHERE id = ${id} AND "userId" = ${userId}
      RETURNING *
    `;
    return (result as any[])[0];
  }

  async markAllAsRead(userId: string) {
    await this.prisma.$queryRaw`
      UPDATE notifications 
      SET status = 'READ', "readAt" = NOW(), "updatedAt" = NOW()
      WHERE "userId" = ${userId} AND status = 'UNREAD'
    `;
    return { success: true };
  }

  async archive(id: string, userId: string) {
    const result = await this.prisma.$queryRaw`
      UPDATE notifications 
      SET status = 'ARCHIVED', "updatedAt" = NOW()
      WHERE id = ${id} AND "userId" = ${userId}
      RETURNING *
    `;
    return (result as any[])[0];
  }

  async remove(id: string, userId: string) {
    await this.prisma.$queryRaw`
      DELETE FROM notifications 
      WHERE id = ${id} AND "userId" = ${userId}
    `;
    return { success: true };
  }

  async getUnreadCount(userId: string): Promise<number> {
    const result = await this.prisma.$queryRaw`
      SELECT COUNT(*) as count FROM notifications 
      WHERE "userId" = ${userId} AND status = 'UNREAD'
    `;
    return parseInt((result as any[])[0].count);
  }

  // 发送系统通知
  async sendSystemNotification(userId: string, title: string, content: string) {
    return this.create({
      userId,
      type: 'SYSTEM' as NotificationType,
      title,
      content,
    });
  }

  // 发送资产状态变更通知
  async sendAssetStatusNotification(
    userId: string,
    assetTitle: string,
    oldStatus: string,
    newStatus: string,
    assetId: string,
  ) {
    return this.create({
      userId,
      type: 'WORKFLOW' as NotificationType,
      title: '资产状态变更',
      content: `作品《${assetTitle}》状态从 ${oldStatus} 变更为 ${newStatus}`,
      relatedId: assetId,
      relatedType: 'IPAsset',
    });
  }

  // 发送授权合同通知
  async sendLicenseNotification(
    userId: string,
    licenseCode: string,
    action: 'created' | 'signed' | 'expired',
    licenseId: string,
  ) {
    const titles = {
      created: '新授权合同',
      signed: '合同已签署',
      expired: '合同即将到期',
    };
    const contents = {
      created: `新授权合同 ${licenseCode} 已创建，等待签署`,
      signed: `授权合同 ${licenseCode} 已签署生效`,
      expired: `授权合同 ${licenseCode} 即将到期，请及时处理`,
    };

    return this.create({
      userId,
      type: 'LICENSE' as NotificationType,
      title: titles[action],
      content: contents[action],
      relatedId: licenseId,
      relatedType: 'License',
    });
  }

  // 发送交易通知
  async sendTransactionNotification(
    userId: string,
    txnCode: string,
    amount: number,
    type: 'completed' | 'refunded',
    txnId: string,
  ) {
    return this.create({
      userId,
      type: 'TRANSACTION' as NotificationType,
      title: type === 'completed' ? '交易完成' : '交易退款',
      content: `交易 ${txnCode} 金额 ¥${amount} 已${type === 'completed' ? '完成' : '退款'}`,
      relatedId: txnId,
      relatedType: 'Transaction',
    });
  }
}
