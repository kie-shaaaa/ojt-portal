import {
  Body,
  Controller,
  Get,
  Post,
  BadRequestException,
  Req,
  Res,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import type { AccountRegister, ChangePasswordResponse } from '../data/types';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '@nestjs/passport';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { AuthenticatedUser } from '../data/interfaces';

const ACCESS_TOKEN_COOKIE = 'access_token';

function getCookieMaxAge(rememberMe?: boolean): number | undefined {
  return rememberMe ? 5 * 24 * 60 * 60 : undefined;
}

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
    @Res({ passthrough: true }) reply: FastifyReply,
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
        body.rememberMe,
      );

      if (result.user.id === undefined) {
        throw new BadRequestException('Invalid user id');
      }

      reply.setCookie(ACCESS_TOKEN_COOKIE, result.access_token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: getCookieMaxAge(body.rememberMe),
      });

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

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  me(@Req() request: FastifyRequest & { user?: AuthenticatedUser }) {
    if (!request.user) {
      throw new UnauthorizedException('Not authenticated');
    }

    return {
      user: request.user,
    };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) reply: FastifyReply) {
    reply.clearCookie(ACCESS_TOKEN_COOKIE, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return {
      message: 'Logged out successfully',
    };
  }

  @Post('change-password')
  @UseGuards(AuthGuard('jwt'))
  async changePassword(
    @Body()
    body: {
      currentPassword: string;
      newPassword: string;
    },
    @Req() request: FastifyRequest & { user?: AuthenticatedUser },
  ): Promise<ChangePasswordResponse> {
    try {
      const email = request.user?.email;

      if (!email) {
        throw new UnauthorizedException('Authentication required');
      }

      await this.authService.changePassword(
        email,
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
