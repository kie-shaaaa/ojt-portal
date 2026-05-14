import { Body, Controller, Get, Patch } from '@nestjs/common';
import type { ApplicationSettings } from '../data/types';
import { DashboardService } from '../services/dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('')
  async getDashboardData() {
    return await this.dashboardService.getDashboardData();
  }

  @Patch('settings')
  async updateApplicationSettings(
    @Body('settings') settings: ApplicationSettings,
  ) {
    return await this.dashboardService.updateApplicationSettings(settings);
  }
}
