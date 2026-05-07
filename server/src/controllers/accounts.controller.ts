import { Controller } from '@nestjs/common';
import { AccountsService } from '../services/accounts.service';
import { Account } from '../data/types';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly service: AccountsService) {}

    async signIn (account: Account) {
        account.password = await this.service.hashPassword(account.password)
        return this.service.signInAccount(account.email, account.password)
    }

    async signUp (account: Account) {
        account.password = await this.service.hashPassword(account.password)
        return this.service.createAccount(account)  
    }


}
