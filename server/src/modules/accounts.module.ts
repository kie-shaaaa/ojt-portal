import { Module } from '@nestjs/common';
import { AccountsController } from '../controllers/accounts.controller';
import { AccountsService } from '../services/accounts.service';
import { AuthModule } from './auth.module';

@Module({
  controllers: [AccountsController],
  providers: [AccountsService],
  imports: [AuthModule],
  exports: [AccountsService],
})
export class AccountsModule {}
