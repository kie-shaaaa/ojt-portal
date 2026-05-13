// mailer.module.ts
import { Module } from '@nestjs/common';
import { MailerService } from '../services/mailer.service';
import { MailerController } from '../controllers/mailer.controller';

@Module({
  controllers: [MailerController],
  providers: [MailerService],
  exports: [MailerService],
  imports: [],
})
export class MailerModule {}
