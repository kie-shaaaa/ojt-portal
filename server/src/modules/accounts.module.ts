import { Module } from '@nestjs/common';
import { AccountsController } from '../controllers/accounts.controller';
import { AccountsService } from '../services/accounts.service';
import { AuthModule } from './auth.module';
import { DatabaseService } from '../services/database/database.service';
import { DatabaseModule } from './database.module';

@Module({
  controllers: [AccountsController],
  providers: [AccountsService],
  imports: [AuthModule, DatabaseModule],
  exports: [AccountsService],
})
export class AccountsModule {}
