import {
  Injectable,
  Inject,
  forwardRef,
  InternalServerErrorException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { Account, AccountCreate } from '../data/types';
import { AuthService } from './auth.service';
import { DatabaseService } from './database/database.service';

@Injectable()
export class AccountsService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly databaseService: DatabaseService,
  ) {}

  async createAccount(id: number, account: AccountCreate): Promise<Account> {
    const client = this.databaseService.getClient();
    try {
      const user = await client.query(
        `
          SELECT account_type FROM user_accounts
          WHERE id = $1
        `,
        [id],
      );

      if (!user) {
        throw new ForbiddenException('User not found');
      }

      if (user.rows[0] != 'admin') {
        throw new ForbiddenException('Only admins can create an account');
      }

      const exists = await this.authService.findUser(account.email);
      if (exists) {
        throw new Error('User already exists');
      }
      const hash = await this.authService.hashPassword(account.password);

      const newUser: AccountCreate = {
        email: account.email,
        password: hash,
        username: account.username,
        account_type: account.account_type,
      };

      const res = await client.query<Account>(
        `
        INSERT INTO user_accounts (email, password, username, account_type)
        VALUES($1, $2, $3, $4)
        RETURNING id, email, password, username, account_type, created_at, updated_at
        `,
        [
          newUser.email,
          newUser.password,
          newUser.username,
          newUser.account_type,
        ],
      );

      return res.rows[0] || null;
    } catch (error) {
      console.error('[ACCOUNTS] Error creating account:', error);
      if (
        error instanceof Error &&
        error.message.includes('User already exists')
      ) {
        throw new BadRequestException('User with this email already exists');
      }
      throw new InternalServerErrorException('Failed to create user account');
    }
  }

  async updateAccount(id: number, newEmail?: string, newType?: string) {
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
        throw new Error('User account does not exist');
      }

      if (exists.rows[0].email != newEmail) {
        await client.query(
          `
          UPDATE user_accounts
          SET email = $1
          WHERE id = $2
          `,
          [newEmail, id],
        );
      }

      if (exists.rows[0].account_type != newType) {
        await client.query(
          `
          UPDATE user_accounts
          SET account_type = $1
          WHERE id = $2
          `,
          [newEmail, id],
        );
      }

      return {
        success: true,
        message: 'Successfully updated account',
      };
    } catch (error) {
      console.error('[ACCOUNTS] Error updating account:', error);
      if (
        error instanceof Error &&
        error.message.includes('User already exists')
      ) {
        throw new BadRequestException('User with this email already exists');
      }
      throw new InternalServerErrorException('Failed to create user account');
    }
  }

  async deleteAccount() {}

  // TODO
  async archiveAccount(id: number) {
    try {
      const client = this.databaseService.getClient();

      const exists = await client.query<Account>(
        `
        SELECT id, email, account_type FROM user_accounts
        WHERE id = $1
        `,
        [id],
      );
      if (!exists) {
        throw new Error('User account does not exist');
      }

      // Model column not yet initialized
      const res = await client.query(
        `UPDATE user_accounts
        SET status = "disabled"
        WHERE id = $1`,
        [id],
      );

      return {
        success: true,
        message: 'Successfully deactivated account',
        data: res || null,
      };
    } catch (error) {
      console.error('[ACCOUNTS] Error deactivating account:', error);
      if (
        error instanceof Error &&
        error.message.includes('User already exists')
      ) {
        throw new BadRequestException('User with this email already exists');
      }
      throw new InternalServerErrorException('Failed to create user account');
    }
  }

  async updatePassword(id: number, newPassword: string) {
    try {
      const client = this.databaseService.getClient();

      const exists = await client.query<Account>(
        `
        SELECT id, email, account_type FROM user_accounts
        WHERE id = $1
        `,
        [id],
      );
      if (!exists) {
        throw new Error('User account does not exist');
      }

      const newHash = await this.authService.hashPassword(newPassword);

      const res = await client.query<Account>(
        `
          UPDATE user_accounts
          SET password = $1,
          WHERE id = $2
        `,
        [newHash, id],
      );

      return {
        success: true,
        message: 'Successfully updated user accounts',
        data: res || null,
      };
    } catch (error) {
      console.error('[ACCOUNTS] Error changing account password:', error);
      if (
        error instanceof Error &&
        error.message.includes('User already exists')
      ) {
        throw new BadRequestException('User with this email already exists');
      }
      throw new InternalServerErrorException('Failed to create user account');
    }
  }
}
