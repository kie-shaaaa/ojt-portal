import { Controller } from '@nestjs/common';
import { AccountsService } from '../services/accounts.service';
import { Account, AccountCreate } from '../data/types';
import { AuthService } from '../services/auth.service';

@Controller('accounts')
export class AccountsController {
  constructor(
    private readonly authService: AuthService,
    private readonly accountsService: AccountsService,
  ) {}

  async signIn(account: Account) {
    account.password = await this.authService.hashPassword(account.password);
    return this.authService.signInAccount(account.email, account.password);
  }

  async signUp(account: AccountCreate) {
    account.password = await this.authService.hashPassword(account.password);
    return this.accountsService.createAccount(account);
  }
}
