import {
  BadRequestException,
  Body,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import type { ApplicationSettings } from '../data/types';

@Injectable()
export class DashboardService {
  constructor(private readonly databaseService: DatabaseService) {}

  //** Applications Setting
  // * */

  async getDashboardData() {}

  async updateApplicationSettings(@Body() settings: ApplicationSettings) {
    const client = this.databaseService.getClient();
    try {
      const update = await client.query(
        `UPDATE application_settings
             SET portal_status = $1, opening_date = $2
             WHERE id = 1
             RETURNING *`,
        [settings.state, settings.openingDate],
      );

      if (update.rowCount === 0) {
        throw new BadRequestException('Application settings not found');
      }

      return {
        status: 200,
        message: 'Settings updated successfully',
        ok: true,
        error: null,
        data: [],
      };
    } catch (error) {
      console.error('[DASHBOARD] Error updating application settings:', error);
      if (
        error instanceof Error &&
        error.message.includes('User already exists')
      ) {
        throw new BadRequestException('User with this email already exists');
      }
      throw new InternalServerErrorException('Failed to create user account');
    }
  }
}
