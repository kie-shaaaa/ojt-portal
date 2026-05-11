import { Body, Controller, Patch } from '@nestjs/common';
import { AccountsService } from '../services/accounts.service';
import { AuthService } from '../services/auth.service';

@Controller('accounts')
export class AccountsController {
  constructor(
    private readonly authService: AuthService,
    private readonly accountsService: AccountsService,
  ) {}

  @Patch('/update')
  async updateAccount(
    @Body('id') id: number,
    @Body('newEmail') newEmail?: string,
    @Body('newType') newType?: string,
  ) {
    return this.accountsService.updateAccount(id, newEmail, newType);
  }
}
