import { Module } from '@nestjs/common';
import { AppointmentsController } from '../controllers/appointments.controller';
import { AppointmentsService } from '../services/appointments.service';
import { DatabaseModule } from './database.module';
import { LogsModule } from './logs.module';

@Module({
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService],
  imports: [DatabaseModule, LogsModule],
})
export class AppointmentsModule {}
