import { Body, Controller, Post } from '@nestjs/common';
import type { Account } from '../data/types';
import { AuthService } from '../services/auth.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('signin')
  async signIn(@Body() account: Account) {
    // Initialize token payload
    const payload = {
      sub: account.email,
      email: account.email,
    };

    // Create token
    const tokens = await this.jwtService.signAsync(payload);
    account.password = await this.authService.hashPassword(account.password);
    return {
      token: tokens,
      user: await this.authService.signInAccount(
        account.email,
        account.password,
      ),
    };
  }
}
