import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { Account } from '../data/types';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async signInAccount(email: string, password: string) {
    try {
      const user = await this.findUser(email);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const isValid = await this.verifyPassword(user.password, password);

      if (!isValid) {
        throw new UnauthorizedException('Invalid password');
      }

      const payload = {
        sub: user.email,
        email: user.email,
      };

      const access_token = await this.jwtService.signAsync(payload);

      return {
        token: access_token,
        user: {
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      };
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
