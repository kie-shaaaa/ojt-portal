import { Module } from '@nestjs/common';
import { AccountsController } from '../controllers/accounts.controller';
import { AccountsService } from '../services/accounts.service';
import { DatabaseModule } from './database.module';
import { AuthModule } from './auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AccountsController],
  providers: [AccountsService],
  imports: [DatabaseModule, AuthModule, JwtModule],
  exports: [AccountsService],
})
export class AccountsModule {}
