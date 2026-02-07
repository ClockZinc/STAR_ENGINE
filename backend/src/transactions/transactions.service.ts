import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionStatus, TransactionType, Prisma } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.TransactionWhereInput;
    orderBy?: Prisma.TransactionOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params;
    return this.prisma.transaction.findMany({
      skip,
      take,
      where,
      orderBy: orderBy || { createdAt: 'desc' },
      include: {
        payer: {
          select: { id: true, nickname: true, avatar: true },
        },
        license: {
          include: {
            asset: {
              select: { title: true, originalUrl: true },
            },
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        payer: {
          select: { id: true, nickname: true, email: true },
        },
        license: {
          include: {
            asset: true,
            licensor: {
              select: { nickname: true },
            },
          },
        },
      },
    });

    if (!transaction) {
      throw new NotFoundException('交易记录不存在');
    }

    return transaction;
  }

  async create(data: any) {
    // 生成交易编号
    const txnCode = await this.generateTxnCode();
    
    return this.prisma.transaction.create({
      data: {
        ...data,
        txnCode: txnCode,
        status: TransactionStatus.PENDING,
      },
    } as any);
  }

  // 创建授权费交易
  async createLicenseFee(licenseId: string, payerId: string, amount: number) {
    const license = await this.prisma.license.findUnique({
      where: { id: licenseId },
    });

    if (!license) {
      throw new NotFoundException('授权合同不存在');
    }

    return this.create({
      type: TransactionType.LICENSE_FEE,
      amount,
      currency: 'CNY',
      description: `授权费 - ${license.licenseCode}`,
      payer: { connect: { id: payerId } },
      license: { connect: { id: licenseId } },
      payeeType: 'USER',
    });
  }

  // 创建版税分成交易
  async createRoyalty(licenseId: string, amount: number, description: string) {
    const license = await this.prisma.license.findUnique({
      where: { id: licenseId },
      include: { asset: true },
    });

    if (!license) {
      throw new NotFoundException('授权合同不存在');
    }

    return this.create({
      type: TransactionType.ROYALTY,
      amount,
      currency: 'CNY',
      description,
      license: { connect: { id: licenseId } },
      payeeType: 'USER',
    });
  }

  // 模拟支付完成（实际项目中对接微信支付/支付宝）
  async completePayment(id: string, paymentMethod: string, paymentRef: string) {
    const transaction = await this.findOne(id);
    
    if (transaction.status !== TransactionStatus.PENDING) {
      throw new BadRequestException('该交易已完成或已取消');
    }

    return this.prisma.transaction.update({
      where: { id },
      data: {
        status: TransactionStatus.COMPLETED,
        paymentMethod,
        paymentRef,
        paidAt: new Date(),
      },
    });
  }

  // 退款
  async refund(id: string, reason: string) {
    const transaction = await this.findOne(id);
    
    if (transaction.status !== TransactionStatus.COMPLETED) {
      throw new BadRequestException('只有已完成的交易可以退款');
    }

    return this.prisma.transaction.update({
      where: { id },
      data: {
        status: TransactionStatus.REFUNDED,
        description: `${transaction.description} [退款: ${reason}]`,
      },
    });
  }

  async getStats() {
    const [
      total,
      pending,
      completed,
      refunded,
    ] = await Promise.all([
      this.prisma.transaction.count(),
      this.prisma.transaction.count({ where: { status: TransactionStatus.PENDING } }),
      this.prisma.transaction.count({ where: { status: TransactionStatus.COMPLETED } }),
      this.prisma.transaction.count({ where: { status: TransactionStatus.REFUNDED } }),
    ]);

    // 按类型统计
    const byType = await this.prisma.transaction.groupBy({
      by: ['type'],
      where: { status: TransactionStatus.COMPLETED },
      _sum: { amount: true },
      _count: { type: true },
    });

    // 月度统计
    const monthlyStats = await this.prisma.transaction.groupBy({
      by: ['createdAt'],
      where: { status: TransactionStatus.COMPLETED },
      _sum: { amount: true },
    });

    return {
      total,
      byStatus: {
        pending,
        completed,
        refunded,
      },
      byType,
      monthlyStats,
    };
  }

  // 获取待结算交易
  async getPendingSettlements() {
    return this.prisma.transaction.findMany({
      where: {
        status: TransactionStatus.PENDING,
        type: {
          in: [TransactionType.ROYALTY, TransactionType.LICENSE_FEE],
        },
      },
      include: {
        license: {
          select: { licenseCode: true },
        },
      },
    });
  }

  private async generateTxnCode(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const count = await this.prisma.transaction.count({
      where: {
        createdAt: {
          gte: new Date(year, date.getMonth(), date.getDate()),
        },
      },
    });
    return `TXN-${year}${month}${day}-${String(count + 1).padStart(4, '0')}`;
  }
}
