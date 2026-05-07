import { Module } from '@nestjs/common';
import { AuthController } from '../auth.controller';
import { AuthService } from '../services/auth.service';
import { AccountsService } from '../services/accounts.service';

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [AuthService, AccountsService],
    exports: [AuthService]
})
export class AuthModule {}
