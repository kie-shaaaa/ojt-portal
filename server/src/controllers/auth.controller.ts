/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import type {
  AccountCreate,
  AccountRegister,
  RegisterResponse,
  ChangePasswordResponse,
} from '../data/types';
import { AuthService } from '../services/auth.service';
import { AccountsService } from '../services/accounts.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly accountService: AccountsService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('signin')
  async signIn(@Body() body: AccountRegister): Promise<{
    access_token: string;
    user: { id: number; email: string; role: string };
  }> {
    if (!body?.email || !body?.password) {
      throw new BadRequestException('Email and password are required');
    }

    const result = await this.authService.signInAccount(body.email, body.password);

    if (result.user.id === undefined) {
      throw new BadRequestException('Invalid user id');
    }

    return {
      access_token: result.access_token,
      user: {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role,
      },
    };
  }

  @Post('register')
  async register(
    @Body() credentials: AccountCreate,
    @Body() id: number,
  ): Promise<RegisterResponse> {
    try {
      // Register new user
      const user = await this.accountService.createAccount(id, credentials);

      // Create JWT token
      const payload = {
        sub: user.id,
        email: user.email,
      };
      const token = await this.jwtService.signAsync(payload);

      return {
        token,
        user,
        message: 'User registered successfully',
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Registration failed';
      throw new BadRequestException(message);
    }
  }

  @Post('change-password')
  async changePassword(
    @Body()
    body: {
      email: string;
      currentPassword: string;
      newPassword: string;
    },
  ): Promise<ChangePasswordResponse> {
    try {
      await this.authService.changePassword(
        body.email,
        body.currentPassword,
        body.newPassword,
      );

      return {
        message: 'Password changed successfully',
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Password change failed';
      throw new BadRequestException(message);
    }
  }
}
