import { Controller, Post } from '@nestjs/common';
import { AccountsService } from '../services/accounts.service';
import type { Account } from '../data/types';
import { AuthService } from '../services/auth.service';

@Controller('accounts')
export class AccountsController {
  constructor(
    private readonly authService: AuthService,
    private readonly accountsService: AccountsService,
  ) {}

  @Post('signup')
  async signUp(account: Account) {
    account.password = await this.authService.hashPassword(account.password);
    return this.accountsService.createAccount(account);
  }
}
