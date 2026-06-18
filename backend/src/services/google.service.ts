import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { throwAppError } from '../utils/handlers';
import { google } from 'googleapis';

@Injectable()
export class GoogleService {
  constructor(private readonly databaseService: DatabaseService) {}

  async insertToken(userId: string, refreshToken: string) {
    const client = this.databaseService.getClient();
    try {
      await client.query(
        `
        UPDATE user_accounts SET google_refresh_token = $1 WHERE id = $2
      `,
        [refreshToken, userId],
      );
    } catch (error) {
      console.error('[GoogleService] Failed to insert token:', error);
      throwAppError('server_error', 'Failed to save Google refresh token');
    }
  }

  async getToken(userId: string): Promise<string> {
    const client = this.databaseService.getClient();
    try {
      const res = await client.query<{ google_refresh_token: string }>(
        `
        SELECT google_refresh_token FROM user_accounts WHERE id = $1
      `,
        [userId],
      );
      const token: string = res.rows[0].google_refresh_token;
      return token;
    } catch (error) {
      console.error('[GoogleService] Failed to get token:', error);
      throwAppError('server_error', 'Failed to retrieve Google refresh token');
    }
  }

  async getAuthClient(userId: string) {
    const refreshToken = await this.getToken(userId);

    if (!refreshToken) {
      throw new Error('Google account not connected');
    }

    const oauth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI,
    );

    oauth.setCredentials({ refresh_token: refreshToken });

    return oauth;
  }
}
