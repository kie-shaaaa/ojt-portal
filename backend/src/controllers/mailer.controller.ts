import {
  Body,
  Controller,
  Post,
  BadRequestException,
  Get,
} from '@nestjs/common';
import { MailerService } from '../services/mailer.service';
import type { ContactMessageDto } from '../data/interfaces';
import dns from 'node:dns/promises';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  private validateEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  @Post('contact')
  async contact(@Body() body: ContactMessageDto): Promise<{
    message: string;
    adminSent: boolean;
    senderSent: boolean;
  }> {
    const email = body?.email?.trim() ?? '';
    const subject = body?.subject?.trim() ?? '';
    const message = body?.message?.trim() ?? '';

    if (!this.validateEmail(email)) {
      throw new BadRequestException('Please enter a valid email address');
    }

    if (message.length > 500) {
      throw new BadRequestException('Message must be 500 characters or less');
    }

    const result = await this.mailerService.contactMessageEmail({
      ...body,
      email,
      subject,
      message,
    });

    return {
      message: 'Your message has been received',
      adminSent: result.adminSent,
      senderSent: result.senderSent,
    };
  }

  @Get('smtp-test')
  async test() {
    const result = await dns.lookup('smtp.hostinger.com', {
      all: true,
    });

    return result;
  }
}
