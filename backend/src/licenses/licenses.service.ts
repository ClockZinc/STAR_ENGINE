import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LicenseStatus, Prisma } from '@prisma/client';

@Injectable()
export class LicensesService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.LicenseWhereInput;
    orderBy?: Prisma.LicenseOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params;
    return this.prisma.license.findMany({
      skip,
      take,
      where,
      orderBy: orderBy || { createdAt: 'desc' },
      include: {
        asset: {
          select: {
            id: true,
            title: true,
            originalUrl: true,
            creator: {
              select: { nickname: true },
            },
          },
        },
        licensor: {
          select: { id: true, nickname: true, email: true },
        },
        transactions: {
          where: { status: 'COMPLETED' },
          select: {
            id: true,
            amount: true,
            type: true,
            createdAt: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const license = await this.prisma.license.findUnique({
      where: { id },
      include: {
        asset: true,
        licensor: {
          select: { id: true, nickname: true, email: true },
        },
        transactions: true,
      },
    });

    if (!license) {
      throw new NotFoundException('授权合同不存在');
    }

    return license;
  }

  async create(data: any) {
    // 生成授权编号
    const licenseCode = await this.generateLicenseCode();
    
    return this.prisma.license.create({
      data: {
        ...data,
        licenseCode: licenseCode,
        status: LicenseStatus.DRAFT,
      } as any,
      include: {
        asset: true,
        licensor: {
          select: { id: true, nickname: true },
        },
      },
    });
  }

  async update(id: string, data: Prisma.LicenseUpdateInput) {
    const license = await this.findOne(id);
    
    // 已生效的合同不能随意修改
    if (license.status === LicenseStatus.ACTIVE) {
      throw new BadRequestException('已生效的合同不能直接修改，请先终止');
    }

    return this.prisma.license.update({
      where: { id },
      data,
      include: {
        asset: true,
        licensor: {
          select: { id: true, nickname: true },
        },
      },
    });
  }

  async signLicense(id: string, userId: string) {
    const license = await this.findOne(id);
    
    if (license.status !== LicenseStatus.DRAFT && license.status !== LicenseStatus.PENDING) {
      throw new BadRequestException('只有草稿或待签署状态的合同可以签署');
    }

    return this.prisma.license.update({
      where: { id },
      data: {
        status: LicenseStatus.ACTIVE,
        signedAt: new Date(),
        effectiveDate: new Date(),
      },
    });
  }

  async freezeLicense(id: string, reason: string) {
    const license = await this.findOne(id);
    
    if (license.status !== LicenseStatus.ACTIVE) {
      throw new BadRequestException('只有生效中的合同可以熔断');
    }

    return this.prisma.license.update({
      where: { id },
      data: {
        status: LicenseStatus.FROZEN,
        isFrozen: true,
        frozenAt: new Date(),
        frozenReason: reason,
      },
    });
  }

  async unfreezeLicense(id: string) {
    const license = await this.findOne(id);
    
    if (license.status !== LicenseStatus.FROZEN) {
      throw new BadRequestException('合同未处于熔断状态');
    }

    return this.prisma.license.update({
      where: { id },
      data: {
        status: LicenseStatus.ACTIVE,
        isFrozen: false,
      },
    });
  }

  async terminateLicense(id: string, reason: string) {
    const license = await this.findOne(id);
    
    if (license.status !== LicenseStatus.ACTIVE && license.status !== LicenseStatus.FROZEN) {
      throw new BadRequestException('只能终止生效中或已冻结的合同');
    }

    return this.prisma.license.update({
      where: { id },
      data: {
        status: LicenseStatus.TERMINATED,
        frozenReason: reason,
      },
    });
  }

  async remove(id: string) {
    const license = await this.findOne(id);
    
    // 只有草稿状态可以删除
    if (license.status !== LicenseStatus.DRAFT) {
      throw new BadRequestException('只能删除草稿状态的合同');
    }

    return this.prisma.license.delete({
      where: { id },
    });
  }

  async getStats() {
    const [
      total,
      active,
      frozen,
      expired,
      terminated,
    ] = await Promise.all([
      this.prisma.license.count(),
      this.prisma.license.count({ where: { status: LicenseStatus.ACTIVE } }),
      this.prisma.license.count({ where: { status: LicenseStatus.FROZEN } }),
      this.prisma.license.count({ where: { status: LicenseStatus.EXPIRED } }),
      this.prisma.license.count({ where: { status: LicenseStatus.TERMINATED } }),
    ]);

    // 计算总收入
    const revenue = await this.prisma.transaction.aggregate({
      where: {
        status: 'COMPLETED',
        licenseId: { not: null },
      },
      _sum: {
        amount: true,
      },
    });

    return {
      total,
      byStatus: {
        active,
        frozen,
        expired,
        terminated,
      },
      totalRevenue: revenue._sum.amount || 0,
    };
  }

  private async generateLicenseCode(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const count = await this.prisma.license.count({
      where: {
        createdAt: {
          gte: new Date(year, 0, 1),
          lt: new Date(year + 1, 0, 1),
        },
      },
    });
    return `LIC-${year}-${String(count + 1).padStart(4, '0')}`;
  }

  // 检查即将到期的合同
  async getExpiringLicenses(days: number = 30) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);

    return this.prisma.license.findMany({
      where: {
        status: LicenseStatus.ACTIVE,
        expiryDate: {
          lte: expiryDate,
          gte: new Date(),
        },
      },
      include: {
        asset: {
          select: { title: true },
        },
        licensor: {
          select: { nickname: true, email: true },
        },
      },
    });
  }
}
