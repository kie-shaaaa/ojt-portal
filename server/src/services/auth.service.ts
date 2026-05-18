import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import type { Account, LogSignIn, SuccessResponse } from '../data/types';
import { DatabaseService } from './database/database.service';
import { JwtService } from '@nestjs/jwt';
import { SuccessHandler } from '../../utils/handlers';
import { LogsService } from './logs.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly logService: LogsService,
  ) {}

  /**
   * Sign in user with email and password
   * @param email User email
   * @param password User password
   * @returns User account without password
   * @throws UnauthorizedException if credentials are invalid
   */

  async signInAccount(email: string, password: string, ipAddress?: string) {
    const user = await this.findActiveUser(email);

    if (!user) throw new UnauthorizedException('Invalid email or password');

    const isValid = await this.verifyPassword(user.password, password);

    if (!isValid) {
      const failed: LogSignIn = {
        userId: user.id,
        success: false,
        ipAddress: ipAddress
      };

      await this.logService.logSignIn(failed);
      
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      account_type: user.account_type,
    };

    const log: LogSignIn = {
      userId: user.id,
      success: true,
      ipAddress: ipAddress
    };

    const access_token = this.jwtService.sign(payload);

    await this.logService.logSignIn(log);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        account_type: user.account_type,
      },
    };
  }

  /**
   * Verify a password against a hash
   * @param hash Argon2 password hash
   * @param password Plain text password
   * @returns Boolean indicating if password is valid
   */
  async verifyPassword(hash: string, password: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, password);
    } catch (error) {
      console.error('Password verification failed', error);
      return false;
    }
  }

  /**
   * Hash a password using argon2
   * @param password Plain text password
   * @returns Hashed password
   */
  async hashPassword(password: string): Promise<string> {
    try {
      return await argon2.hash(password);
    } catch (error) {
      console.error('Password hashing failed', error);
      throw new InternalServerErrorException('Failed to process password');
    }
  }

  /**
   * Log authentication attempts for security auditing
   * @param email User email
   * @param success Whether the attempt was successful
   * @param metadata Additional metadata about the attempt (e.g., 'registration', 'password_reset')
   * @param userId Optional user ID for audit logging
   * @param ipAddress Optional IP address
   * @param userAgent Optional user agent string
   */

  /**
   * Find user by email
   * @param email User email
   * @returns User account or null if not found
   */
  async findActiveUser(email: string): Promise<Account | null> {
    if (!email) {
      throw new BadRequestException('Email is required');
    }

    const client = this.databaseService.getClient();
    try {
      const result = await client.query<Account>(
        `
          SELECT id, email, password, account_type, created_at, updated_at FROM user_accounts
          WHERE email = $1 AND account_status = 'active'; 
        `,
        [email.toLowerCase()],
      );

      return result.rows[0] || null;
    } catch (error) {
      console.error('findUser failed', error);
      throw new InternalServerErrorException('Failed to find user');
    }
  }

  /**
   * Find user by id
   * @param id User id
   * @returns User account or null if not found
   */
  async findUserById(id: number): Promise<SuccessResponse> {
    if (!id) {
      throw new BadRequestException('Email is required');
    }

    const client = this.databaseService.getClient();
    try {
      const result = await client.query<Omit<Account, 'password'>>(
        `
          SELECT *
          FROM user_accounts
          WHERE id = $1;
        `,
        [id],
      );

      return SuccessHandler('User found successfully', result.rows[0] || null);
    } catch (error) {
      console.error('findUser failed', error);
      throw new InternalServerErrorException('Failed to find user');
    }
  }

  /**
   * Validate if user is admin
   * @param id user id to search
   * @returns boolean
   */
  async isAdmin(id: number) {
    const client = this.databaseService.getClient();
    try {
      const user = await client.query(
        `SELECT account_type FROM user_accounts
        WHERE id = $1 AND account_type = $2`,
        [id, 'admin'],
      );
      if (!user) {
        return false;
      }
      return true;
    } catch (error) {
      console.error('findUser failed', error);
      throw new InternalServerErrorException('Failed to find user');
    }
  }

  /**
   * Validate email format
   * @param email Email to validate
   * @returns Boolean indicating if email is valid
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Change user password
   * @param email User email
   * @param currentPassword Current password
   * @param newPassword New password
   */
  async changePassword(
    email: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    if (!currentPassword || !newPassword) {
      throw new BadRequestException('Current and new passwords are required');
    }

    if (newPassword.length < 8) {
      throw new BadRequestException(
        'New password must be at least 8 characters long',
      );
    }

    const user = await this.findActiveUser(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isValid = await this.verifyPassword(user.password, currentPassword);
    if (!isValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const hashedPassword = await this.hashPassword(newPassword);
    const client = this.databaseService.getClient();

    try {
      await client.query(
        `
          UPDATE user_accounts
          SET password = $1, updated_at = $2
          WHERE email = $3;
        `,
        [hashedPassword, new Date(), email],
      );
    } catch (error) {
      console.error('Password change failed', error);
      throw new InternalServerErrorException('Failed to change password');
    }
  }

  /**
   * Generic audit log method
   * @param userId User ID performing the action
   * @param action Log action type
   * @param targetType Type of target being affected
   * @param targetId ID of the target
   * @param targetName Name of the target
   * @param details Additional details
   * @param ipAddress Optional IP address
   * @param userAgent Optional user agent string
   */
  async logAction(
    userId: number,
    action:
      | 'user_created'
      | 'user_updated'
      | 'user_deleted'
      | 'user_status_changed'
      | 'password_reset'
      | 'account_locked'
      | 'account_unlocked'
      | 'other',
    targetType: string,
    targetId?: number,
    targetName?: string,
    details?: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    const client = this.databaseService.getClient();
    try {
      await client.query(
        `
          INSERT INTO logs (user_id, action, target_type, target_id, target_name, details, ip_address, user_agent, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
        `,
        [
          userId,
          action,
          targetType,
          targetId || null,
          targetName || null,
          details || null,
          ipAddress || null,
          userAgent || null,
          new Date(),
        ],
      );
    } catch (error) {
      console.error('Failed to log action', error);
    }
  }
}
