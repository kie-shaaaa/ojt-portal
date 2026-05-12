import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AccountsService } from '../services/accounts.service';
import type { AccountCreate } from '../data/types';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../data/guards/roles.guard';
import { Roles } from '../data/decorators/roles.decorator';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get('test-guard')
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  testGuard(@Req() req: Request & { user?: unknown }) {
    return {
      message: 'Guard passed successfully',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      user: req.user,
    };
  }

  @Post('create')
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async createAccount(
    @Body('id') id: number,
    @Body('account') account: AccountCreate,
  ) {
    return await this.accountsService.createAccount(id, account);
  }

  @Patch('update')
  async updateAccount(
    @Body('id') id: number,
    @Body('newEmail') newEmail?: string,
    @Body('newType') newType?: string,
  ) {
    return this.accountsService.updateAccount(id, newEmail, newType);
  }

  @Patch('disable')
  async disableAccount(@Body('id') id: number) {
    return this.accountsService.disableAccount(id);
  }
}
