import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

export interface UploadedFile {
  filename: string;
  originalName: string;
  url: string;
  size: number;
  mimetype: string;
}

@Injectable()
export class UploadService {
  private uploadDir: string;
  private baseUrl: string;

  constructor(private configService: ConfigService) {
    this.uploadDir = this.configService.get<string>('UPLOAD_DIR', './uploads');
    this.baseUrl = '/uploads';
    this.ensureUploadDir();
  }

  private ensureUploadDir() {
    const dirs = [
      this.uploadDir,
      path.join(this.uploadDir, 'assets'),
      path.join(this.uploadDir, 'avatars'),
      path.join(this.uploadDir, 'contracts'),
      path.join(this.uploadDir, 'temp'),
    ];
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    type: 'asset' | 'avatar' | 'contract' = 'asset',
  ): Promise<UploadedFile> {
    if (!file) {
      throw new BadRequestException('没有上传文件');
    }

    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('不支持的文件类型');
    }

    // 验证文件大小 (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('文件大小超过10MB限制');
    }

    // 生成文件名
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    const subDir = type === 'asset' ? 'assets' : type === 'avatar' ? 'avatars' : 'contracts';
    const filePath = path.join(this.uploadDir, subDir, filename);

    // 保存文件
    fs.writeFileSync(filePath, file.buffer);

    return {
      filename,
      originalName: file.originalname,
      url: `${this.baseUrl}/${subDir}/${filename}`,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  async uploadMultiple(
    files: Express.Multer.File[],
    type: 'asset' | 'avatar' | 'contract' = 'asset',
  ): Promise<UploadedFile[]> {
    return Promise.all(files.map(file => this.uploadFile(file, type)));
  }

  async deleteFile(filename: string, type: 'asset' | 'avatar' | 'contract'): Promise<void> {
    const subDir = type === 'asset' ? 'assets' : type === 'avatar' ? 'avatars' : 'contracts';
    const filePath = path.join(this.uploadDir, subDir, filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  getFilePath(filename: string, type: 'asset' | 'avatar' | 'contract'): string {
    const subDir = type === 'asset' ? 'assets' : type === 'avatar' ? 'avatars' : 'contracts';
    return path.join(this.uploadDir, subDir, filename);
  }
}
