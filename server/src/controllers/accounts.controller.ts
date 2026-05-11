import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Patch,
  Post,
} from '@nestjs/common';
import { AccountsService } from '../services/accounts.service';
import { AuthService } from '../services/auth.service';
import type { AccountCreate } from '../data/types';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post('create')
  async createAccount(
    @Body('id') id: number,
    @Body('account') account: AccountCreate,
  ) {
    return await this.accountsService.createAccount(id, account);
  }

  @Patch('/update')
  async updateAccount(
    @Body('id') id: number,
    @Body('newEmail') newEmail?: string,
    @Body('newType') newType?: string,
  ) {
    return this.accountsService.updateAccount(id, newEmail, newType);
  }
}
