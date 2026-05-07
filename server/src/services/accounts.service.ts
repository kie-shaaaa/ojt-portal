import { Injectable } from '@nestjs/common';
import { Account } from '../data/types';
import { AuthService } from './auth.service';

@Injectable()
export class AccountsService {
  constructor(private readonly authService: AuthService) {}

  async createAccount(account: Account) {
    try {
      const exists = await this.authService.findUser(account.email);
      if (exists) {
        throw new Error('User already exists');
      }
      const hash = await this.authService.hashPassword(account.password);

      const newUser: Account = {
        email: account.email,
        password: hash,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // TODO: Implement database query to create new user with newUser object
      return newUser;
    } catch (error) {
      return error;
    }
  }

  async updateAccount() {}

  async deleteAccount() {}

  async deactivateAccount() {}

  async updatePassword(hash: string, newPassword: string) {
    const newHash = await this.authService.hashPassword(newPassword);
    return newHash;
  }
}
