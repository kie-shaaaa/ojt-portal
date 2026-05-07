import { Injectable } from '@nestjs/common';
import * as argon2 from "argon2"
import { Account } from '../data/types';

@Injectable()
export class AccountsService {
    
    async createAccount(account: Account) {
        try {
            
            const exists = await this.findUser(account.email)
            if (exists) {
                throw new Error('User already exists')
            }
            const hash = await this.hashPassword(account.password)

            const newUser: Account = {
                email: account.email,
                password: hash,
                createdAt: new Date(),
                updatedAt: new Date()
            }

            // TODO: Implement database query to create new user with newUser object
            return newUser
            
        } catch (error) {
            return error;
        }
    }

    async signInAccount(email: string, password: string) {
        try {
            const user = await this.findUser(email)
            if (!user) {
                throw new Error('User not found')
            }

            const isValid = await this.verifyPassword(user.password, password)

            if (!isValid) {
                throw new Error('Invalid password')
            }

            return user
            
        } catch (error) {
            return error;
        }
    }

    async updateAccount() {

    }

    async deleteAccount() {
    }

    async deactivateAccount() {
    }

    async logSignIn() {
    }

    async findUser(email: string): Promise<Account | null> {
        try {
            // TODO: Implement database query to find user by email
            const user: Account = {
                email: "admin",
                password: await this.hashPassword("admin123"),
                createdAt: new Date(),
                updatedAt: new Date()
            }
            return user
        } catch (error) {
            return null;
        }
    }

    async updatePassword(hash: string, newPassword: string) {
        const newHash = await argon2.hash(newPassword)
        return newHash
    }

    async verifyPassword(hash: string, password: string) {
        const isValid = await argon2.verify(hash, password)
        return isValid
    }

    async hashPassword(password: string) {
        const hash = await argon2.hash(password)
        return hash
    }

}
