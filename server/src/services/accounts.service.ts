import { Injectable, Inject, forwardRef } from '@nestjs/common';
import type { Account, AccountCreate, SuccessResponse } from '../data/types';
import { AuthService } from './auth.service';
import { DatabaseService } from './database/database.service';
import { SuccessHandler, throwAppError } from '../../utils/handlers';

@Injectable()
export class AccountsService {
  resetPassword(id: number, newPassword: string) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly databaseService: DatabaseService,
  ) {}

  async createAccount(account: AccountCreate): Promise<SuccessResponse> {
    const client = this.databaseService.getClient();
    try {
      const exists = await this.authService.findActiveUser(account.email);
      if (exists) {
        throwAppError('conflict', 'User with this email already exists');
      }

      const hashedPassword = await this.authService.hashPassword(
        account.password,
      );

      const res = await client.query<Omit<Account, 'password'>>(
        `
  INSERT INTO user_accounts (email, password, username, account_type)
  VALUES($1, $2, $3, $4)
  RETURNING id, email, username, account_type, created_at, updated_at
  `,
        [account.email, hashedPassword, account.username, account.account_type],
      );

      return SuccessHandler('Successfully created account', res.rows[0]);
    } catch (error) {
      console.error('[ACCOUNTS] Error creating account:', error);
      throwAppError('server_error', 'Failed to create user account');
    }
  }

  async updateAccount(id: number, newUser?: string, newType?: string) {
    const client = this.databaseService.getClient();
    try {
      const exists = await client.query<Account>(
        `
        SELECT id, email, username, account_type FROM user_accounts
        WHERE id = $1
        `,
        [id],
      );

      if (exists.rowCount === 0) {
        throwAppError('not_found', 'User account does not exist');
      }

      if (newUser && exists.rows[0].username !== newUser) {
        await client.query(
          `
          UPDATE user_accounts
          SET username = $1
          WHERE id = $2
          `,
          [newUser, id],
        );
      }

      if (newType && exists.rows[0].account_type !== newType) {
        await client.query(
          `
          UPDATE user_accounts
          SET account_type = $1
          WHERE id = $2
          `,
          [newType, id],
        );
      }

      return SuccessHandler('Successfully updated account');
    } catch (error) {
      console.error('[ACCOUNTS] Error updating account:', error);
      throwAppError('server_error', 'Failed to update user account');
    }
  }

  async fetchActiveAccounts(count: number, type?: string, createdDate?: Date) {
    const client = this.databaseService.getClient();

    try {
      const values: any[] = [];
      let query = `
        SELECT id, email, username, account_type, created_at
        FROM user_accounts
        WHERE account_status = 'active' AND 1=1
      `;

      if (type) {
        values.push(type);
        query += ` AND account_type = $${values.length}`;
      }

      if (createdDate) {
        values.push(createdDate);
        query += ` AND created_at >= $${values.length}`;
      }

      query += ` ORDER BY created_at DESC`;

      if (count && count > 0) {
        values.push(count);
        query += ` LIMIT $${values.length}`;
      }

      const accounts = await client.query<
        Omit<Account, 'password' | 'updated_at'>
      >(query, values);

      if (accounts.rows.length === 0) {
        throwAppError('not_found', 'No accounts found matching the criteria');
      }

      return SuccessHandler('Successfully fetched accounts', accounts.rows);
    } catch (error) {
      console.error('[ACCOUNTS] Error fetching accounts:', error);
      throwAppError('server_error', 'Failed to fetch accounts');
    }
  }

  async fetchAllAccounts(count: number, type?: string, createdDate?: Date) {
    const client = this.databaseService.getClient();

    try {
      const values: any[] = [];
      let query = `
        SELECT id, email, account_type, created_at
        FROM user_accounts
        WHERE 1=1
      `;

      if (type) {
        values.push(type);
        query += ` AND account_type = $${values.length}`;
      }

      if (createdDate) {
        values.push(createdDate);
        query += ` AND created_at >= $${values.length}`;
      }

      query += ` ORDER BY created_at DESC`;

      if (count && count > 0) {
        values.push(count);
        query += ` LIMIT $${values.length}`;
      }

      const accounts = await client.query<
        Omit<Account, 'password' | 'updated_at'>
      >(query, values);

      if (accounts.rows.length === 0) {
        throwAppError('not_found', 'No accounts found matching the criteria');
      }

      return SuccessHandler('Successfully fetched accounts', accounts.rows);
    } catch (error) {
      console.error('[ACCOUNTS] Error fetching accounts:', error);
      throwAppError('server_error', 'Failed to fetch accounts');
    }
  }

  async deleteAccount(id: number) {
    try {
      const client = this.databaseService.getClient();

      const res = await client.query(
        `DELETE FROM user_accounts
        WHERE id = $1`,
        [id],
      );

      return SuccessHandler('Successfully deactivated account', res || null);
    } catch (error) {
      console.error('[ACCOUNTS] Error deactivating account:', error);
      throwAppError('server_error', 'Failed to deactivate account');
    }
  }

  async disableAccount(id: number) {
    const client = this.databaseService.getClient();
    try {
      const exists = await client.query<Account>(
        `
        SELECT id, email, account_type FROM user_accounts
        WHERE id = $1
        `,
        [id],
      );
      if (!exists) {
        throwAppError('not_found', 'User account does not exist');
      }

      const res = await client.query(
        `UPDATE user_accounts
        SET account_status = 'disabled'
        WHERE id = $1`,
        [id],
      );

      return SuccessHandler('Successfully deactivated account', res || null);
    } catch (error) {
      console.error('[ACCOUNTS] Error deactivating account:', error);
      throwAppError('server_error', 'Failed to deactivate account');
    }
  }

  async updatePassword(id: number, newPassword: string) {
    const client = this.databaseService.getClient();
    try {
      const exists = await client.query<Account>(
        `
        SELECT id, email, account_type FROM user_accounts
        WHERE id = $1
        `,
        [id],
      );
      if (exists.rowCount === 0) {
        throwAppError('not_found', 'User account does not exist');
      }

      const newHash = await this.authService.hashPassword(newPassword);

      const res = await client.query<Account>(
        `
          UPDATE user_accounts
          SET password = $1
          WHERE id = $2
        `,
        [newHash, id],
      );

      return SuccessHandler('Successfully updated user account', res || null);
    } catch (error) {
      console.error('[ACCOUNTS] Error changing account password:', error);
      throwAppError('server_error', 'Failed to update user account password');
    }
  }
}
