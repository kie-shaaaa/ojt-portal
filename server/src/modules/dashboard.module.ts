import { Module } from '@nestjs/common';
import { DashboardService } from '../services/dashboard.service';
import { DashboardController } from '../controllers/dashboard.controller';
import { DatabaseModule } from './database.module';

@Module({
  exports: [DashboardService],
  controllers: [DashboardController],
  providers: [DashboardService],
  imports: [DatabaseModule],
})
export class DashboardModule {}
