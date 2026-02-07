import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NfcService {
  constructor(private prisma: PrismaService) {}

  async verifyNfc(nfcUuid: string) {
    const item = await this.prisma.physicalItem.findUnique({
      where: { nfcUuid },
      include: {
        asset: {
          include: {
            creator: {
              select: { nickname: true },
            },
          },
        },
        nfcRecords: {
          orderBy: { scannedAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!item) {
      return { isAuthentic: false, message: '未找到该NFC对应的商品' };
    }

    // 记录本次扫描
    await this.prisma.nFCRecord.create({
      data: {
        itemId: item.id,
        isAuthentic: true,
      },
    });

    return {
      isAuthentic: true,
      item,
    };
  }
}
