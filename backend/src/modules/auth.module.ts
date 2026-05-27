import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from './database.module';
import { AccountsModule } from './accounts.module';
import { JwtStrategy } from '../data/strategy/jwt.strategy';
import { LogsModule } from './logs.module';

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => AccountsModule),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '5d',
      },
    }),
    LogsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
