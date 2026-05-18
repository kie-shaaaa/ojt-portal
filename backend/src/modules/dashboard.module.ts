import { Module } from '@nestjs/common';
import { DashboardService } from '../services/dashboard.service';
import { DashboardController } from '../controllers/dashboard.controller';
import { DatabaseModule } from './database.module';
import { LogsModule } from './logs.module';

@Module({
  exports: [DashboardService],
  controllers: [DashboardController],
  providers: [DashboardService],
  imports: [DatabaseModule, LogsModule],
})
export class DashboardModule {}
