import { Injectable } from '@nestjs/common';
import * as argon2 from "argon2"
import { Account, AccountCreate } from '../data/types';
import { AuthService } from './auth.service';
import { DatabaseService } from './database/database.service';

@Injectable()
export class AccountsService {
    constructor(private readonly authService: AuthService,
        private readonly databaseService: DatabaseService) { }
    
    async createAccount(account: AccountCreate) {
        const client = await this.databaseService.getClient();
        try {
            const exists = await this.authService.findUser(account.email)
            if (exists) {
                throw new Error('User already exists')
            }
            const hash = await this.authService.hashPassword(account.password)

            const newUser: AccountCreate = {
                email: account.email,
                password: hash,
                username: account.username,
                account_type: account.account_type,
            }

            const res = client.query<AccountCreate>(`
                INSERT INTO user_accounts (email, password, username, account_type)
                VALUES($1, $2, $3, $4)
            `, [newUser.email, newUser.password, newUser.username, newUser.account_type]);


            return res.rows[0] || null;
        } catch (error) {
            return 
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
