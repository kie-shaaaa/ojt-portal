import { Module, forwardRef } from '@nestjs/common';
import { AccountsController } from '../controllers/accounts.controller';
import { AccountsService } from '../services/accounts.service';
import { DatabaseModule } from './database.module';
import { AuthModule } from './auth.module';
import { DashboardModule } from './dashboard.module';

@Module({
  controllers: [AccountsController],
  providers: [AccountsService],
  imports: [DatabaseModule, forwardRef(() => AuthModule), DashboardModule],
  exports: [AccountsService],
})
export class AccountsModule {}
