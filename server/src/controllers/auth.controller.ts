import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import type { AccountCreate, AccountRegister } from '../data/types';
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
  async signIn(@Body() body: any) {
    console.log('SignIn Request Body:', body);

    let credentials: AccountRegister;
    if (typeof body === 'string') {
      try {
        // If it's a string missing braces like: "email": "...", "password": "..."
        // We wrap it in braces to make it valid JSON
        credentials = JSON.parse(`{${body}}`);
      } catch (e) {
        // If it's just a raw string that isn't JSON-like
        throw new BadRequestException(
          'Invalid request body format. Expected JSON object.',
        );
      }
    } else {
      credentials = body;
    }

    if (!credentials || !credentials.email || !credentials.password) {
      throw new BadRequestException('Email and password are required');
    }

    // Sign in user with plain text password
    const user = await this.authService.signInAccount(
      credentials.email,
      credentials.password,
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
  }

  @Post('register')
  async register(@Body() credentials: AccountCreate) {
    // Register new user
    const user = await this.accountService.createAccount(credentials);

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
  }

  @Post('change-password')
  async changePassword(
    @Body()
    body: {
      email: string;
      currentPassword: string;
      newPassword: string;
    },
  ) {
    await this.authService.changePassword(
      body.email,
      body.currentPassword,
      body.newPassword,
    );

    return {
      message: 'Password changed successfully',
    };
  }
}
