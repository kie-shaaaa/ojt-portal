import { Body, Controller, Post } from '@nestjs/common';
import { AccountsService } from '../services/accounts.service';
import type { Account, AccountCreate } from '../data/types';
import { AuthService } from '../services/auth.service';

@Controller('accounts')
export class AccountsController {
  constructor(
    private readonly authService: AuthService,
    private readonly accountsService: AccountsService,
  ) {}

  @Post('signup')
  async signUp(@Body() account: AccountCreate): Promise<Account> {
    console.log('Received account creation request:', account);
    account.password = await this.authService.hashPassword(account.password);
    return this.accountsService.createAccount(account);
  }
}
