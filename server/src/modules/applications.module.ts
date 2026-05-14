import { Module } from '@nestjs/common';
import { ApplicationsService } from '../services/applications.service';
import { ApplicationsController } from '../controllers/applications.controller';
import { DatabaseModule } from './database.module';
import { StorageModule } from './storage.module';
import { MailerModule } from './mailer.module';

@Module({
  imports: [DatabaseModule, StorageModule, MailerModule],
  exports: [ApplicationsService],
  providers: [ApplicationsService],
  controllers: [ApplicationsController],
})
export class ApplicationsModule {}
