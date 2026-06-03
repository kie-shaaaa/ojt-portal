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
import { AppointmentsModule } from './modules/appointments.module';
import { SchoolsModule } from './modules/schools.module';
import { CoursesModule } from './modules/courses.module';
import { DatabaseModule } from './modules/database.module';
import { MailerModule } from './modules/mailer.module';
import { LogsModule } from './modules/logs.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronjobService } from './services/cronjob.service';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { RequestContextModule } from './modules/request-context.module';
import { RequestContextInterceptor } from './interceptors/request-context.interceptor';
import { CsrfGuard } from './data/guards/csrf.guard';
import { CronjobModule } from './modules/cronjob.module';

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
    LogsModule,
    RequestContextModule,
    MailerModule,
    CronjobModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController, DashboardController],
  providers: [
    AppService,
    DashboardService,
    JwtService,
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestContextInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: CsrfGuard,
    },
  ],
})
export class AppModule {}
