import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { LogsModule } from './logs.module';
import { MailerModule } from './mailer.module';
import { CronjobService } from '../services/cronjob.service';
import { StorageModule } from './storage.module';

@Module({
  providers: [CronjobService],
  exports: [CronjobService],
  imports: [DatabaseModule, LogsModule, MailerModule, StorageModule],
})
export class CronjobModule {}
