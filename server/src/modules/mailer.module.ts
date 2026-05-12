import { Module } from '@nestjs/common';
import { MailerService } from '../services/mailer.service';

@Module({
  exports: [MailerService],
  providers: [MailerService],
})
export class MailerModule {}
