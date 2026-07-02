import {
  Body,
  Controller,
  BadRequestException,
  Get,
  Post,
  Query,
  Patch,
  Header,
} from '@nestjs/common';
import type { AppointmentType } from '../data/types';
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
      type: AppointmentType;
    },
  ) {
    try {
      const { applicationId, appointmentDate, type } = body;

      if (!applicationId || !appointmentDate || !type) {
        throw new BadRequestException(
          'applicationId, appointmentDate, and type are required',
        );
      }

      const parsedDate = new Date(appointmentDate);

      if (isNaN(parsedDate.getTime())) {
        throw new BadRequestException('Invalid appointmentDate');
      }

      return await this.appointmentService.updateAppointment(
        applicationId,
        parsedDate,
        type,
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

  @Post('confirm')
  async confirmAppointment(
    @Body()
    body: {
      applicationId: number;
      kind?: 'orientation' | 'interview';
    },
  ) {
    try {
      const { applicationId, kind } = body;

      if (!applicationId) {
        throw new BadRequestException('applicationId is required');
      }

      return await this.appointmentService.confirmAppointment(
        applicationId,
        kind,
      );
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Failed to confirm appointment',
      );
    }
  }

  @Get('review-reschedule')
  @Header('Content-Type', 'text/html')
  async reviewReschedulePage(
    @Query('applicationId') applicationId?: string,
    @Query('type') type?: AppointmentType,
    @Query('decision') decision?: 'approve' | 'reject',
  ) {
    try {
      const parsedApplicationId = applicationId
        ? Number(applicationId)
        : undefined;

      if (!parsedApplicationId || !type || !decision) {
        return `<!DOCTYPE html>
<html>
<head><title>Invalid Request</title></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px;">
  <h1 style="color: #cf222e;">Invalid Request</h1>
  <p>Missing required parameters: applicationId, type, and decision are required.</p>
</body>
</html>`;
      }

      if (decision === 'approve') {
        await this.appointmentService.approveReschedule(
          parsedApplicationId,
          type,
        );
      } else {
        await this.appointmentService.rejectReschedule(
          parsedApplicationId,
          type,
        );
      }

      const actionLabel = decision === 'approve' ? 'Approved' : 'Rejected';
      const color = decision === 'approve' ? '#1a7f37' : '#cf222e';

      return `<!DOCTYPE html>
<html>
<head><title>Reschedule ${actionLabel}</title></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px;">
  <div style="background: ${color}; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
    <h1 style="margin: 0;">Reschedule Request ${actionLabel}</h1>
  </div>
  <p>The reschedule request has been successfully ${actionLabel.toLowerCase()}.</p>
  <p><strong>Application ID:</strong> ${parsedApplicationId}</p>
  <p><strong>Appointment Type:</strong> ${type}</p>
  <p style="margin-top: 30px; color: #666;">This page can be closed. You may also receive a confirmation email.</p>
</body>
</html>`;
    } catch (error) {
      return `<!DOCTYPE html>
<html>
<head><title>Error</title></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px;">
  <h1 style="color: #cf222e;">Error</h1>
  <p>${error instanceof Error ? error.message : 'Failed to review reschedule'}</p>
</body>
</html>`;
    }
  }
}
