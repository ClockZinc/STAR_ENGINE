import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AssetsModule } from './assets/assets.module';
import { LicensesModule } from './licenses/licenses.module';
import { TransactionsModule } from './transactions/transactions.module';
import { NfcModule } from './nfc/nfc.module';
import { UploadModule } from './upload/upload.module';
import { WorkflowModule } from './workflow/workflow.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    AssetsModule,
    LicensesModule,
    TransactionsModule,
    NfcModule,
    UploadModule,
    WorkflowModule,
    AnalyticsModule,
    NotificationsModule,
  ],
})
export class AppModule {}
