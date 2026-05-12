import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import type {
  AccountCreate,
  AccountRegister,
  SignInResponse,
  RegisterResponse,
  ChangePasswordResponse,
} from '../data/types';
import { AuthService } from '../services/auth.service';
import { JwtService } from '@nestjs/jwt';
import { AccountsService } from '../services/accounts.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly accountService: AccountsService,
  ) {}

  @Post('signin')
  async signIn(@Body() body: AccountRegister): Promise<SignInResponse> {
    console.log('SignIn Request Body:', body);

    if (!body || !body.email || !body.password) {
      throw new BadRequestException('Email and password are required');
    }

    try {
      // Sign in user with plain text password
      const user = await this.authService.signInAccount(
        body.email,
        body.password,
      );

      // Create JWT token
      const payload = {
        sub: user.id,
        email: user.email,
      };
      const token = await this.jwtService.signAsync(payload);

      return {
        token,
        user,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign in failed';
      throw new BadRequestException(message);
    }
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
