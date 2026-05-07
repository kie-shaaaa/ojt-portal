import { Module } from '@nestjs/common';
import { AccountsController } from '../controllers/accounts.controller';
import { AccountsService } from '../services/accounts.service';
import { ApplicationsModule } from './applications.module';
import { AuthService } from '../services/auth.service';

@Module({
  controllers: [AccountsController],
  providers: [AccountsService],
  imports: [ApplicationsModule, AuthService],
  exports: [AccountsService]
})
export class AccountsModule {}
