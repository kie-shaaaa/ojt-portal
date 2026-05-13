import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountsModule } from './modules/accounts.module';
import { AuthModule } from './modules/auth.module';
import { ApplicationsModule } from './modules/applications.module';
import { OjtModule } from './modules/ojt.module';
import { DashboardController } from './controllers/dashboard.controller';
import { DashboardService } from './services/dashboard.service';
import { JwtService } from '@nestjs/jwt';
import { AppointmentsController } from './controllers/appointments.controller';
import { AppointmentsService } from './services/appointments.service';
import { AppointmentsModule } from './modules/appointments.module';
import { SchoolsModule } from './modules/schools.module';
import { CoursesModule } from './modules/courses.module';
import { DatabaseModule } from './modules/database.module';
import { MailerService } from './services/mailer.service';

@Module({
  imports: [
    DatabaseModule,
    AccountsModule,
    AuthModule,
    ApplicationsModule,
    OjtModule,
    AppointmentsModule,
    SchoolsModule,
    CoursesModule,
  ],
  controllers: [AppController, DashboardController],
  providers: [AppService, DashboardService, JwtService, MailerService],
})
export class AppModule {}
