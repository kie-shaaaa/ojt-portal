import {
  Body,
  Controller,
  Post,
  BadRequestException,
  Req,
} from '@nestjs/common';
import type { AccountRegister, ChangePasswordResponse } from '../data/types';
import { AuthService } from '../services/auth.service';
import type { FastifyRequest } from 'fastify';

function extractClientIp(request: FastifyRequest): string | undefined {
  const forwardedFor = request.headers['x-forwarded-for'];
  if (typeof forwardedFor === 'string' && forwardedFor.trim()) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = request.headers['x-real-ip'];
  if (typeof realIp === 'string' && realIp.trim()) {
    return realIp.trim();
  }

  return request.ip || request.socket?.remoteAddress || undefined;
}
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signIn(
    @Body() body: AccountRegister,
    @Req() request: FastifyRequest,
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

      body.ipAddress = extractClientIp(request);

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
