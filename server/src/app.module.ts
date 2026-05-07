import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountsModule } from './modules/accounts.module';
import { AuthModule } from './modules/auth.module';
import { DatabaseService } from './services/database/database.service';
import { ApplicationsModule } from './modules/applications.module';

@Module({
  imports: [AccountsModule, AuthModule, ApplicationsModule],
  controllers: [AppController],
  providers: [AppService, DatabaseService],
})
export class AppModule {}
