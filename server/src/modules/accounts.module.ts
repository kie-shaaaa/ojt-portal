import { Module, forwardRef } from '@nestjs/common';
import { AccountsController } from '../controllers/accounts.controller';
import { AccountsService } from '../services/accounts.service';
import { DatabaseModule } from './database.module';
import { AuthModule } from './auth.module';
import { JwtModule } from '@nestjs/jwt';
import { AppointmentsModule } from './appointments.module';

@Module({
  controllers: [AccountsController],
  providers: [AccountsService],
  imports: [DatabaseModule, forwardRef(() => AuthModule), JwtModule, AppointmentsModule],
  exports: [AccountsService],
})
export class AccountsModule {}
