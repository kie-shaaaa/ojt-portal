import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  BadRequestException,
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
  /**
  // DEVELOPMENT ONLY: This endpoint is for testing the AuthGuard and RolesGuard functionality.
  @Get('test-guard')
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  testGuard(@Req() req: Request & { user?: any }) {
    console.log('Hello from the test guard endpoint!');
    return {
      message: 'Guard passed successfully',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      user: req.user,
    };
  }

  /**
   * Account fetching controller (Active accounts only)
   * @param count Number of fetched accounts
   * @param type Type/Role of fetched accounts
   * @param createdDate Date of fetched accounts creation
   * @returns Array of accounts matching the provided criteria
   */
  @Get('active')
  async getActiveAccounts(
    @Param('count') count: number,
    @Param('type') type?: string,
    @Param('createdDate') createdDate?: Date,
  ) {
    try {
      return await this.accountsService.fetchActiveAccounts(
        Number(count),
        type,
        createdDate ? new Date(createdDate) : undefined,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to fetch active accounts';
      throw new BadRequestException(message);
    }
  }

  /**
   * Account fetching controller (Active and disabled accounts)
   * @param count Number of fetched accounts
   * @param type Type/Role of fetched accounts
   * @param createdDate Date of fetched accounts creation
   * @returns Array of accounts matching the provided criteria
   */
  @Get('all')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async getAllAccounts(
    @Param('count') count: number,
    @Param('type') type?: string,
    @Param('createdDate') createdDate?: Date,
  ) {
    try {
      return await this.accountsService.fetchAllAccounts(
        count,
        type,
        createdDate,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch all accounts';
      throw new BadRequestException(message);
    }
  }

  /**
   * Accounts creation controller
   * @param account Account data for the new account
   * @return Created account data
   */
  @Post('create')
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async createAccount(@Body('newAccount') account: AccountCreate) {
    return await this.accountsService.createAccount(account);
  }

  /**
   * Accounts update controller
   * @param id ID of the account to update
   * @param newEmail New email for the account (optional)
   * @param newType New type/role for the account (optional)
   * @return Updated account data
   */
  @Patch('update')
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async updateAccount(
    @Body()
    body: {
      id: number;
      newUser?: string;
      newType?: string;
    },
  ) {
    return this.accountsService.updateAccount(
      body.id,
      body.newUser,
      body.newType,
    );
  }

  @Post('reset-password')
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async updatePassword(@Body() body: { id: number; newPassword: string }) {
    return await this.accountsService.updatePassword(body.id, body.newPassword);
  }

  /**
   * @param id account id of the account to be disabled
   * @return success message if the account was successfully disabled
   * @throws BadRequestException if the account with the provided id does not exist
   * @throws InternalServerErrorException if there was an error disabling the account
   */
  @Patch('disable')
  async disableAccount(@Body('id') id: number) {
    return this.accountsService.disableAccount(id);
  }
}
