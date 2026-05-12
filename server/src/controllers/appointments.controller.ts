import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { AppointmentType } from '../data/types';
import { AppointmentsService } from '../services/appointments.service';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentService: AppointmentsService) {}

  @Post('create')
  async createAppointment(
    @Body()
    body: {
      type: AppointmentType;
      appointmentDate: string; // ISO string from frontend
    },
  ) {
    try {
      const { type, appointmentDate } = body;

      if (!type || !appointmentDate) {
        throw new BadRequestException('type and appointmentDate are required');
      }

      const parsedDate = new Date(appointmentDate);

      if (isNaN(parsedDate.getTime())) {
        throw new BadRequestException('Invalid appointmentDate');
      }

      return await this.appointmentService.addAppointment(type, parsedDate);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to create appointment',
      );
    }
  }
}
