import {
  Body,
  Controller,
  Get,
  Patch,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import type { ApplicationSettings } from '../data/types';
import { DashboardService } from '../services/dashboard.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('')
  @UseGuards(AuthGuard('jwt'))
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
  @UseGuards(AuthGuard('jwt'))
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
