/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import type { AccountRegister, ChangePasswordResponse } from '../data/types';
import { AuthService } from '../services/auth.service';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signIn(@Body() body: AccountRegister): Promise<{
    access_token: string;
    user: { id: number; email: string; role: string };
  }> {
    if (!body?.email || !body?.password) {
      throw new BadRequestException('Email and password are required');
    }

    const result = await this.authService.signInAccount(
      body.email,
      body.password,
    );

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
