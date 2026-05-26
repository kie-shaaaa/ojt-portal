import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { MailerService } from '../services/mailer.service';
import type { ContactMessageDto } from '../data/interfaces';

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
    const fullName = body?.fullName?.trim() ?? '';
    const email = body?.email?.trim() ?? '';
    const subject = body?.subject?.trim() ?? '';
    const message = body?.message?.trim() ?? '';

    if (!fullName || !email || !subject || !message) {
      throw new BadRequestException('All contact fields are required');
    }

    if (!this.validateEmail(email)) {
      throw new BadRequestException('Please enter a valid email address');
    }

    if (fullName.length > 25) {
      throw new BadRequestException('Name must be 25 characters or less');
    }

    if (message.length > 500) {
      throw new BadRequestException('Message must be 500 characters or less');
    }

    const result = await this.mailerService.contactMessageEmail({
      ...body,
      fullName,
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

}
