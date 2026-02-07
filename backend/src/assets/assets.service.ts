import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AssetWorkflowStatus, Prisma } from '@prisma/client';

@Injectable()
export class AssetsService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.IPAssetWhereUniqueInput;
    where?: Prisma.IPAssetWhereInput;
    orderBy?: Prisma.IPAssetOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.iPAsset.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        creator: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const asset = await this.prisma.iPAsset.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
          },
        },
        licenses: true,
      },
    });

    if (!asset) {
      throw new NotFoundException('资产不存在');
    }

    return asset;
  }

  async create(data: Prisma.IPAssetCreateInput) {
    return this.prisma.iPAsset.create({
      data,
    });
  }

  async update(id: string, data: Prisma.IPAssetUpdateInput) {
    return this.prisma.iPAsset.update({
      where: { id },
      data,
    });
  }

  async updateStatus(id: string, status: AssetWorkflowStatus) {
    return this.prisma.iPAsset.update({
      where: { id },
      data: { status },
    });
  }

  async remove(id: string) {
    return this.prisma.iPAsset.delete({
      where: { id },
    });
  }

  // 获取资产统计
  async getStats() {
    const [
      total,
      raw,
      enhanced,
      threeD,
      legalLocked,
      contracted,
    ] = await Promise.all([
      this.prisma.iPAsset.count(),
      this.prisma.iPAsset.count({ where: { status: AssetWorkflowStatus.RAW } }),
      this.prisma.iPAsset.count({ where: { status: AssetWorkflowStatus.ENHANCED } }),
      this.prisma.iPAsset.count({ where: { status: AssetWorkflowStatus.THREE_D_DONE } }),
      this.prisma.iPAsset.count({ where: { status: AssetWorkflowStatus.LEGAL_LOCKED } }),
      this.prisma.iPAsset.count({ where: { status: AssetWorkflowStatus.CONTRACTED } }),
    ]);

    return {
      total,
      byStatus: {
        raw,
        enhanced,
        threeD,
        legalLocked,
        contracted,
      },
    };
  }
}
