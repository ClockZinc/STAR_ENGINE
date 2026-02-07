import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WorkflowService } from './workflow.service';
import { TransitionDto, FreezeDto } from './dto/workflow.dto';

@ApiTags('工作流')
@Controller('workflow')
export class WorkflowController {
  constructor(private workflowService: WorkflowService) {}

  @Get('assets/:id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取资产工作流状态' })
  async getStatus(@Param('id') assetId: string) {
    return this.workflowService.getAssetStatus(assetId);
  }

  @Post('assets/:id/transition')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '执行状态流转' })
  async transition(
    @Param('id') assetId: string,
    @Body() dto: TransitionDto,
    @Request() req,
  ) {
    return this.workflowService.transition(
      assetId,
      dto.targetStatus,
      req.user.userId,
      req.user.role,
      dto.reason,
    );
  }

  @Post('assets/:id/freeze')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '熔断资产（品牌防火墙）' })
  async freeze(
    @Param('id') assetId: string,
    @Body() dto: FreezeDto,
    @Request() req,
  ) {
    return this.workflowService.freezeAsset(
      assetId,
      req.user.userId,
      dto.reason,
    );
  }

  @Post('assets/:id/unfreeze')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '解冻资产' })
  async unfreeze(
    @Param('id') assetId: string,
    @Body() dto: FreezeDto,
    @Request() req,
  ) {
    return this.workflowService.unfreezeAsset(
      assetId,
      req.user.userId,
      dto.reason,
    );
  }

  @Get('assets/:id/history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取资产审计历史' })
  async getHistory(@Param('id') assetId: string) {
    return this.workflowService.getAuditHistory(assetId);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取工作流统计' })
  async getStats() {
    return this.workflowService.getWorkflowStats();
  }

  @Post('batch/transition')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '批量状态流转' })
  async batchTransition(
    @Body() dto: { assetIds: string[]; targetStatus: any },
    @Request() req,
  ) {
    return this.workflowService.batchTransition(
      dto.assetIds,
      dto.targetStatus,
      req.user.userId,
      req.user.role,
    );
  }
}
