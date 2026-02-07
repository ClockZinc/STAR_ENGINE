import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTransactionDto, CompletePaymentDto } from './dto/transaction.dto';
import { TransactionStatus, TransactionType } from '@prisma/client';

@ApiTags('交易流水')
@Controller('transactions')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取交易列表' })
  async findAll(
    @Query('status') status?: string,
    @Query('type') type?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const skip = (page - 1) * limit;
    return this.transactionsService.findAll({
      skip,
      take: +limit,
      where: {
        ...(status && { status: status as TransactionStatus }),
        ...(type && { type: type as TransactionType }),
      },
    });
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取交易统计' })
  async getStats() {
    return this.transactionsService.getStats();
  }

  @Get('pending-settlements')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取待结算交易' })
  async getPendingSettlements() {
    return this.transactionsService.getPendingSettlements();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取交易详情' })
  async findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建交易' })
  async create(@Body() dto: CreateTransactionDto, @Request() req) {
    return this.transactionsService.create({
      ...dto,
      payer: dto.payerId ? { connect: { id: dto.payerId } } : undefined,
      license: dto.licenseId ? { connect: { id: dto.licenseId } } : undefined,
    });
  }

  @Post(':id/complete')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '完成支付（模拟）' })
  async completePayment(@Param('id') id: string, @Body() dto: CompletePaymentDto) {
    return this.transactionsService.completePayment(
      id,
      dto.paymentMethod,
      dto.paymentRef,
    );
  }

  @Post(':id/refund')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '退款' })
  async refund(@Param('id') id: string, @Body() dto: { reason: string }) {
    return this.transactionsService.refund(id, dto.reason);
  }

  @Post('license-fee')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建授权费交易' })
  async createLicenseFee(
    @Body() dto: { licenseId: string; amount: number },
    @Request() req,
  ) {
    return this.transactionsService.createLicenseFee(
      dto.licenseId,
      req.user.userId,
      dto.amount,
    );
  }

  @Post('royalty')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建版税交易' })
  async createRoyalty(
    @Body() dto: { licenseId: string; amount: number; description: string },
  ) {
    return this.transactionsService.createRoyalty(
      dto.licenseId,
      dto.amount,
      dto.description,
    );
  }
}
