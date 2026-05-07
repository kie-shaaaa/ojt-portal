import { Body, Controller, Post } from '@nestjs/common';
import type { Account } from '../data/types';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signin')
  async signIn(@Body() account: Account) {
    console.log(account);
    account.password = await this.authService.hashPassword(account.password);
    return this.authService.signInAccount(account.email, account.password);
  }
}
