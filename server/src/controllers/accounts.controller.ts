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

}
