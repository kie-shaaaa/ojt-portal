import {
  Body,
  Controller,
  Get,
  Patch,
  BadRequestException,
} from '@nestjs/common';
import type { ApplicationSettings } from '../data/types';
import { DashboardService } from '../services/dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('')
  async getDashboardData() {
    try {
      return await this.dashboardService.getDashboardData();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to fetch dashboard data';
      throw new BadRequestException(message);
    }
  }

  @Patch('settings')
  async updateApplicationSettings(
    @Body('settings') settings: ApplicationSettings,
  ) {
    try {
      return await this.dashboardService.updateApplicationSettings(settings);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to update settings';
      throw new BadRequestException(message);
    }
  }
}
