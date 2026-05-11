/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    filename: string;
    content?: string | Buffer;
    path?: string;
  }>;
}

@Injectable()
export class BrevoService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_EMAIL || process.env.MAIL_USER || '',
        pass: process.env.BREVO_KEY,
      },
    });
  }

  private getFromAddress(): string {
    return process.env.MAIL_FROM || process.env.BREVO_EMAIL || '';
  }

  async sendMail(options: EmailOptions) {
    if (!process.env.BREVO_KEY) {
      throw new Error('Brevo SMTP key not configured (BREVO_KEY)');
    }

    try {
      const result = await this.transporter.sendMail({
        from: options.from || this.getFromAddress(),
        to: Array.isArray(options.to) ? options.to.join(',') : options.to,
        cc: options.cc
          ? Array.isArray(options.cc)
            ? options.cc.join(',')
            : options.cc
          : undefined,
        bcc: options.bcc
          ? Array.isArray(options.bcc)
            ? options.bcc.join(',')
            : options.bcc
          : undefined,
        subject: options.subject,
        text: options.text,
        html: options.html,
        attachments: options.attachments,
      });

      return {
        success: true,
        messageId: result.messageId,
        response: result,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('Brevo send error:', err);
      throw new Error(`Failed to send email via Brevo: ${message}`);
    }
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (err) {
      console.error('Brevo connection error:', err);
      return false;
    }
  }

  async sendTextEmail(to: string, subject: string, text: string) {
    return this.sendMail({ to, subject, text });
  }

  async sendHtmlEmail(to: string, subject: string, html: string) {
    return this.sendMail({ to, subject, html });
  }
}
