import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApplicationsController } from './controllers/applications.controller';
import { ApplicationsService } from './services/applications.service';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { DatabaseService } from './services/database/database.service';

@Module({
  imports: [],
  controllers: [AppController, ApplicationsController, AuthController],
  providers: [
    AppService,
    DatabaseService,
    ApplicationsService, AuthService],
})
export class AppModule {}
