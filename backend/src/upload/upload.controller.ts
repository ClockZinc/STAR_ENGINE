import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Body,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UploadService } from './upload.service';

@ApiTags('文件上传')
@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('asset')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '上传资产文件' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAsset(@UploadedFile() file: Express.Multer.File) {
    const result = await this.uploadService.uploadFile(file, 'asset');
    return {
      success: true,
      data: result,
    };
  }

  @Post('assets/batch')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '批量上传资产文件' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadMultipleAssets(@UploadedFiles() files: Express.Multer.File[]) {
    const results = await this.uploadService.uploadMultiple(files, 'asset');
    return {
      success: true,
      data: results,
    };
  }

  @Post('avatar')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '上传头像' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    const result = await this.uploadService.uploadFile(file, 'avatar');
    return {
      success: true,
      data: result,
    };
  }

  @Post('contract')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '上传合同文件' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadContract(@UploadedFile() file: Express.Multer.File) {
    const result = await this.uploadService.uploadFile(file, 'contract');
    return {
      success: true,
      data: result,
    };
  }
}
