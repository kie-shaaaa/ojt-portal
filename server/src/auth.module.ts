import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { DatabaseService } from './services/database/database.service';

@Module({
  providers: [AuthService, DatabaseService],
  exports: [AuthService, DatabaseService],
})
export class AuthModule {}
