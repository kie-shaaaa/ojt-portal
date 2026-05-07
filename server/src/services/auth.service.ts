import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { Account, AccountRegister } from '../data/types';
import { DatabaseService } from './database/database.service';

@Injectable()
export class AuthService {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Sign in user with email and password
   * @param email User email
   * @param password User password
   * @returns User account without password
   * @throws UnauthorizedException if credentials are invalid
   */
  async signInAccount(
    email: string,
    password: string,
  ): Promise<Omit<Account, 'password'>> {
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    const user = await this.findUser(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isValid = await this.verifyPassword(user.password, password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Log successful sign-in
    await this.logSignIn(email, true, null, user.id);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Register a new user account
   * @param email User email
   * @param password User password
   * @returns Created user account without password
   * @throws BadRequestException if email is invalid
   * @throws ConflictException if email already exists
   */
  async registerAccount(
    email: string,
    password: string,
  ): Promise<Omit<Account, 'password'>> {
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    // Validate email format
    if (!this.isValidEmail(email)) {
      throw new BadRequestException('Invalid email format');
    }

    // Validate password strength
    if (password.length < 8) {
      throw new BadRequestException(
        'Password must be at least 8 characters long',
      );
    }

    // Check if user already exists
    const existingUser = await this.findUser(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await this.hashPassword(password);
    const client = await this.databaseService.getClient();

    try {
      const now = new Date();
      const result = await client.query<Account>(
        `
          INSERT INTO user_accounts (email, password, created_at, updated_at)
          VALUES ($1, $2, $3, $4)
          RETURNING id, email, created_at, updated_at;
        `,
        [email, hashedPassword, now, now],
      );

      const createdUser = result.rows[0];
      await this.logSignIn(email, true, 'registration', createdUser.id);

      return {
        id: createdUser.id,
        email: createdUser.email,
        created_at: createdUser.created_at,
        updated_at: createdUser.updated_at,
      };
    } catch (error) {
      console.error('Registration failed', error);
      await this.logSignIn(email, false, `Registration error: ${error}`);
      throw new InternalServerErrorException('Failed to register user');
    }
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
  async logSignIn(
    email: string,
    success: boolean,
    metadata: string | null = null,
    userId?: number,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    const client = await this.databaseService.getClient();
    try {
      const timestamp = new Date();
      const status = success ? 'SUCCESS' : 'FAILED';

      // Log to console for monitoring
      console.log(
        `[AUTH] Sign-in ${status} for ${email} at ${timestamp.toISOString()}`,
      );

      // Store in database audit trail
      if (userId) {
        // Map metadata to log action enum
        let action = 'other';
        if (metadata === 'registration') {
          action = 'user_created';
        } else if (metadata === 'password_reset') {
          action = 'password_reset';
        }

        await client.query(
          `
            INSERT INTO logs (user_id, action, target_type, target_id, target_name, details, ip_address, user_agent, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
          `,
          [
            userId,
            action,
            'user',
            userId,
            email,
            metadata || (success ? 'Sign-in successful' : 'Sign-in failed'),
            ipAddress || null,
            userAgent || null,
            timestamp,
          ],
        );
      }
    } catch (error) {
      console.error('Failed to log sign-in event', error);
      // Don't throw here - logging failure shouldn't break auth flow
    }
  }

  /**
   * Find user by email
   * @param email User email
   * @returns User account or null if not found
   */
  async findUser(email: string): Promise<Account | null> {
    if (!email) {
      throw new BadRequestException('Email is required');
    }

    const client = await this.databaseService.getClient();
    try {
      const result = await client.query<Account>(
        `
          SELECT id, email, password, created_at, updated_at FROM user_accounts
          WHERE email = $1;
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

    const user = await this.findUser(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isValid = await this.verifyPassword(user.password, currentPassword);
    if (!isValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const hashedPassword = await this.hashPassword(newPassword);
    const client = await this.databaseService.getClient();

    try {
      await client.query(
        `
          UPDATE user_accounts
          SET password = $1, updated_at = $2
          WHERE email = $3;
        `,
        [hashedPassword, new Date(), email],
      );

      await this.logSignIn(email, true, 'password_reset', user.id);
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
    const client = await this.databaseService.getClient();
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
