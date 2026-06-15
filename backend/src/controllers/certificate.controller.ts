import {
  Controller,
  Post,
  Body,
  ForbiddenException,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { Res, Req } from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { google } from 'googleapis';
import { CertificateService } from '../services/certificate.service';
import { GoogleService } from '../services/google.service';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';

@Controller('certificates')
export class CertificateController {
  constructor(
    private readonly certificateService: CertificateService,
    private readonly googleService: GoogleService,
  ) {}

  @Post('bulk')
  @UseGuards(AuthGuard('jwt'))
  async generateBulkCertificates(
    @Req() req: FastifyRequest,
    @Res() reply: FastifyReply,
    @Body() body: { ojtIds: string[] },
  ) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        throw new ForbiddenException('Unauthorized');
      }
      if (!body?.ojtIds?.length) {
        throw new BadRequestException('No OJT IDs provided');
      }

      // 1. Get refresh token
      const refreshToken = await this.googleService.getToken(userId);
      if (!refreshToken) {
        throw new ForbiddenException('Google account not connected');
      }

      // 2. Build proper OAuth2 client ✅
      const authClient = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI,
      );
      authClient.setCredentials({ refresh_token: refreshToken });

      // 3. Generate ZIP stream
      const zipStream = await this.certificateService.generateFromOjtIds(
        body.ojtIds,
        authClient,
      );

      // 4. Fastify headers
      reply
        .header('Content-Type', 'application/zip')
        .header('Content-Disposition', 'attachment; filename=certificates.zip');

      // 5. Stream response
      return reply.send(zipStream);
    } catch (error) {
      console.error('[CertificateController] Error:', error);
      if (
        error instanceof ForbiddenException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new ForbiddenException('Failed to generate certificates');
    }
  }
}
