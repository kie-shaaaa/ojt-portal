import {
  Body,
  Controller,
  BadRequestException,
  Get,
  Post,
  Query,
  Patch,
} from '@nestjs/common';
import { AppointmentType } from '../data/types';
import { AppointmentsService } from '../services/appointments.service';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentService: AppointmentsService) {}

  @Get('fetch-calendar')
  async fetchAppointments(
    @Query('month') month?: string,
    @Query('year') year?: string,
  ) {
    try {
      if (!month || !year) {
        throw new BadRequestException('month and year are required');
      }

      return await this.appointmentService.getAppointments(month, year);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to fetch appointment',
      );
    }
  }

  @Patch('update')
  async updateAppointment(
    @Body()
    body: {
      applicationId: number;
      appointmentDate: string;
    },
  ) {
    try {
      const { applicationId, appointmentDate } = body;

      if (!applicationId || !appointmentDate) {
        throw new BadRequestException(
          'applicationId and appointmentDate are required',
        );
      }

      const parsedDate = new Date(appointmentDate);

      if (isNaN(parsedDate.getTime())) {
        throw new BadRequestException('Invalid appointmentDate');
      }

      return await this.appointmentService.updateAppointment(
        applicationId,
        parsedDate,
      );
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to update appointment',
      );
    }
  }

  @Patch('cancel-appointment')
  async cancelAppointment(
    @Body()
    body: {
      appointmentId: number;
      cancellationReason?: string;
    },
  ) {
    try {
      const { appointmentId, cancellationReason } = body;

      if (!appointmentId) {
        throw new BadRequestException('appointment id are required');
      }

      return await this.appointmentService.cancelAppointment(
        appointmentId,
        cancellationReason,
      );
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to cancel appointment',
      );
    }
  }

  @Patch('completed-appointment')
  async completedAppointment(
    @Body()
    body: {
      appointmentId: number;
    },
  ) {
    try {
      const { appointmentId } = body;

      if (!appointmentId) {
        throw new BadRequestException('appointment id are required');
      }

      return await this.appointmentService.completedAppointment(appointmentId);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Failed to complete appointment',
      );
    }
  }

  @Post('create')
  async createAppointment(
    @Body()
    body: {
      type: AppointmentType;
      appointmentDate: string;
      applicationId: number;
    },
  ) {
    try {
      const { type, appointmentDate, applicationId } = body;

      if (!type || !appointmentDate || !applicationId) {
        throw new BadRequestException(
          'type, application_id, and appointmentDate are required',
        );
      }

      const parsedDate = new Date(appointmentDate);

      if (isNaN(parsedDate.getTime())) {
        throw new BadRequestException('Invalid appointmentDate');
      }

      return await this.appointmentService.addAppointment(
        type,
        parsedDate,
        applicationId,
      );
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to create appointment',
      );
    }
  }
}
