import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountsModule } from './modules/accounts.module';
import { AuthModule } from './modules/auth.module';
import { DatabaseService } from './services/database/database.service';
import { ApplicationsModule } from './modules/applications.module';
import { OjtModule } from './modules/ojt.module';
import { DashboardController } from './controllers/dashboard.controller';
import { DashboardService } from './services/dashboard.service';

@Module({
  imports: [AccountsModule, AuthModule, ApplicationsModule, OjtModule],
  controllers: [AppController, DashboardController],
  providers: [AppService, DatabaseService, DashboardService],
})
export class AppModule {}
