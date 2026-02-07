import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@ApiTags('消息通知')
@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取通知列表' })
  async findAll(@Request() req, @Query('status') status?: string) {
    return this.notificationsService.findAll(req.user.userId, status as any);
  }

  @Get('unread-count')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取未读通知数量' })
  async getUnreadCount(@Request() req) {
    const count = await this.notificationsService.getUnreadCount(req.user.userId);
    return { count };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取通知详情' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.notificationsService.findOne(id, req.user.userId);
  }

  @Patch(':id/read')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '标记为已读' })
  async markAsRead(@Param('id') id: string, @Request() req) {
    return this.notificationsService.markAsRead(id, req.user.userId);
  }

  @Patch('read-all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '全部标记为已读' })
  async markAllAsRead(@Request() req) {
    return this.notificationsService.markAllAsRead(req.user.userId);
  }

  @Patch(':id/archive')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '归档通知' })
  async archive(@Param('id') id: string, @Request() req) {
    return this.notificationsService.archive(id, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除通知' })
  async remove(@Param('id') id: string, @Request() req) {
    return this.notificationsService.remove(id, req.user.userId);
  }
}
