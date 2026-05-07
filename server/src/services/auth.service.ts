import { Injectable } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import * as argon2 from 'argon2';
import { Account } from '../data/types';

@Injectable()
export class AuthService {
  async signInAccount(email: string, password: string) {
    try {
      const user = await this.findUser(email);
      if (!user) {
        throw new Error('User not found');
      }

      const isValid = await this.verifyPassword(user.password, password);

      if (!isValid) {
        throw new Error('Invalid password');
      }

      return user;
    } catch (error) {
      return error;
    }
  }

  async verifyPassword(hash: string, password: string) {
    const isValid = await argon2.verify(hash, password);
    return isValid;
  }

  async hashPassword(password: string) {
    const hash = await argon2.hash(password);
    return hash;
  }

  async logSignIn() {}

  async findUser(email: string): Promise<Account | null> {
    try {
      // TODO: Implement database query to find user by email
      const user: Account = {
        email: 'admin',
        password: await this.hashPassword('admin123'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return user;
    } catch (error) {
      return null;
    }
  }
}
