/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Body,
  Controller,
  Post,
  BadRequestException,
  Ip,
} from '@nestjs/common';
import type { AccountRegister, ChangePasswordResponse } from '../data/types';
import { AuthService } from '../services/auth.service';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signIn(
    @Body() body: AccountRegister,
    @Ip() ipAddress: string,
  ): Promise<{
    access_token: string;
    user: {
      id: number;
      email: string;
      account_type: string;
    };
  }> {
    try {
      if (!body?.email || !body?.password) {
        throw new BadRequestException('Email and password are required');
      }

      let clientIp = ipAddress;
      if (clientIp === '::1' || clientIp === '127.0.0.1' || !clientIp) {
        clientIp = '203.0.113.195';
      }
      body.ipAddress = clientIp;

      const result = await this.authService.signInAccount(
        body.email,
        body.password,
        body.ipAddress,
      );

      if (result.user.id === undefined) {
        throw new BadRequestException('Invalid user id');
      }

      return {
        access_token: result.access_token,
        user: {
          id: result.user.id,
          email: result.user.email,
          account_type: result.user.account_type,
        },
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to sign in';
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
