import { Module } from '@nestjs/common';
import { AccountsController } from '../controllers/accounts.controller';
import { AccountsService } from '../services/accounts.service';
import { ApplicationsModule } from './applications.module';

@Module({
  controllers: [AccountsController],
  providers: [AccountsService],
  imports: [ApplicationsModule]
})
export class AccountsModule {}
