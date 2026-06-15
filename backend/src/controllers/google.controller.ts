import {
  Controller,
  Get,
  Query,
  Req,
  BadRequestException,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { google } from 'googleapis';
import { GoogleService } from '../services/google.service';
import type { RequestWithUser } from '../data/interfaces';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';

@Controller('google')
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  @Get('debug')
  debug() {
    return {
      clientId: process.env.GOOGLE_CLIENT_ID?.slice(0, 20) + '...',
      clientIdLength: process.env.GOOGLE_CLIENT_ID?.length,
      secret: process.env.GOOGLE_CLIENT_SECRET?.slice(0, 10) + '...',
      redirectUri: process.env.GOOGLE_REDIRECT_URI,
    };
  }
  
  @Get('status')
  @UseGuards(AuthGuard('jwt'))
  async status(@Req() req: RequestWithUser) {
    const token = await this.googleService.getToken(req.user.id);

    return {
      connected: !!token,
    };
  }

  @Get('connect')
  @UseGuards(AuthGuard('jwt'))
  connect(@Req() req: RequestWithUser) {
    const oauth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI,
    );

    return {
      url: oauth.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: [
          'https://www.googleapis.com/auth/drive',
          'https://www.googleapis.com/auth/presentations',
        ],
        state: req.user.id,
      }),
    };
  }

  @Get('callback')
  async callback(@Query('code') code: string, @Query('state') userId: string) {
    try {
      if (!code || !userId) {
        throw new BadRequestException('Missing OAuth parameters');
      }

      const oauth = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI,
      );

      const { tokens } = await oauth.getToken(code);

      if (!tokens.refresh_token) {
        throw new BadRequestException('No refresh token returned from Google');
      }

      await this.googleService.insertToken(userId, tokens.refresh_token);

      return {
        success: true,
        message: 'Google connected successfully',
      };
    } catch (err) {
      console.error('Google OAuth callback failed:', err);

      if (err instanceof BadRequestException) {
        throw err;
      }

      throw new InternalServerErrorException(
        'Failed to complete Google OAuth callback',
      );
    }
  }
}
