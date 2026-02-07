import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 全局管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // CORS配置
  app.enableCors({
    origin: ['http://43.143.239.236', 'http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Swagger API文档
  const config = new DocumentBuilder()
    .setTitle('星光引擎 API')
    .setDescription('Starlight Engine - 自闭症儿童艺术创作与IP商业化平台')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // 全局前缀
  app.setGlobalPrefix('api/v1');

  // 静态文件服务（上传的文件）
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 星光引擎后端服务已启动`);
  console.log(`📡 监听端口: ${port}`);
  console.log(`📚 API文档: http://localhost:${port}/api/docs`);
}
bootstrap();
