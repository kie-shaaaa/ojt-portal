import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountsModule } from './modules/accounts.module';
import { ApplicationsController } from './controllers/applications.controller';
import { ApplicationsService } from './services/applications.service';
import { AuthService } from './services/auth.service';
import { AuthModule } from './auth.module';
import { AuthController } from './auth.controller';
import { DatabaseService } from './services/database/database.service';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [AccountsModule, AuthModule],
  controllers: [AppController, ApplicationsController, AuthController],
  providers: [AppService, DatabaseService, ApplicationsService, AuthService],
})
export class AppModule {}
