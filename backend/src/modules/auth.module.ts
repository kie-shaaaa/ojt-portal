import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from './database.module';
import { AccountsModule } from './accounts.module';
import { JwtStrategy } from '../data/strategy/jwt.strategy';
import { LogsModule } from './logs.module';

function requireJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is missing');
  }

  return secret;
}

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => AccountsModule),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: requireJwtSecret(),
        signOptions: {
          issuer: 'ntc-ojt-auth',
          audience: 'ntc-ojt-web',
        },
      }),
    }),
    LogsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
