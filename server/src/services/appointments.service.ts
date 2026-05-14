/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { AppointmentType } from '../data/types';

@Injectable()
export class AppointmentsService {
  constructor(private readonly databaseService: DatabaseService) {}

  private async updateAppointmentStatus(
    id: number,
    updates: { isCancelled?: boolean; isDone?: boolean },
    notFoundMessage: string,
  ) {
    const client = this.databaseService.getClient();

    const result = await client.query(
      `
        UPDATE appointments
        SET
          is_cancelled = COALESCE($2, is_cancelled),
          is_done = COALESCE($3, is_done)
        WHERE id = $1
        RETURNING *
      `,
      [id, updates.isCancelled ?? null, updates.isDone ?? null],
    );

    if (result.rowCount === 0) {
      throw new BadRequestException(notFoundMessage);
    }

    return result.rows[0];
  }

  async addAppointment(
    type: AppointmentType,
    appointmentDate: Date,
    applicationId: number,
  ) {
    const client = this.databaseService.getClient();

    try {
      const duplicate = await client.query(
        `
          SELECT * FROM appointments
          WHERE type = $1 AND
          application_id = $2
        `,
        [type, applicationId],
      );

      if ((duplicate.rowCount ?? 0) > 0) {
        throw new InternalServerErrorException('Appointment already exists');
      }

      const result = await client.query(
        `
      INSERT INTO appointments (type, appointment_date, application_id)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
        [type, appointmentDate, applicationId],
      );

      if (result.rows.length === 0) {
        throw new InternalServerErrorException('Failed to create appointment');
      }

      return {
        success: true,
        message: 'Appointment created successfully',
        data: result.rows[0],
      };
    } catch (error) {
      console.error('[APPOINTMENT] Error:', error);

      throw new InternalServerErrorException('Failed to create appointment');
    }
  }

  async cancelAppointment(id: number) {
    try {
      await this.updateAppointmentStatus(
        id,
        { isCancelled: true, isDone: false },
        'Appointment not found',
      );

      return {
        status: 200,
        message: 'Appointment cancelled successfully',
        ok: true,
        error: null,
        data: null,
      };
    } catch (error) {
      console.error('[APPOINTMENT] Error cancelling appointment:', error);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to cancel appointment');
    }
  }

  async updateAppointment(applicationId: number, appointmentDate: Date) {
    const client = this.databaseService.getClient();
    console.log(applicationId, appointmentDate);
    try {
      const result = await client.query(
        `
          UPDATE appointments
          SET appointment_date = $1
          WHERE application_id = $2
          RETURNING *
        `,
        [appointmentDate, applicationId],
      );

      if (result.rowCount === 0) {
        throw new BadRequestException(
          'No appointment found for this application',
        );
      }

      return {
        status: 200,
        message: 'Appointment date updated successfully',
        ok: true,
        error: null,
        data: result.rows[0],
      };
    } catch (error) {
      console.error('[APPOINTMENT] Error updating appointment:', error);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to update appointment');
    }
  }

  async completedAppointment(id: number) {
    try {
      await this.updateAppointmentStatus(
        id,
        { isDone: true, isCancelled: false },
        'Appointment not found',
      );

      return {
        status: 200,
        message: 'Appointment updated successfully',
        ok: true,
        error: null,
        data: null,
      };
    } catch (error) {
      console.error('[APPOINTMENT] Error completing appointment:', error);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to complete appointment');
    }
  }

  async getAppointments(month: string, year: string) {
    const client = this.databaseService.getClient();

    try {
      const monthNumber = parseInt(month, 10);
      const yearNumber = parseInt(year, 10);

      if (
        isNaN(monthNumber) ||
        isNaN(yearNumber) ||
        monthNumber < 1 ||
        monthNumber > 12
      ) {
        throw new BadRequestException('Invalid month or year');
      }

      // Start of month (e.g. 2026-05-01 00:00:00)
      const startDate = new Date(yearNumber, monthNumber - 1, 1);

      // Start of next month (exclusive upper bound)
      const endDate = new Date(yearNumber, monthNumber, 1);

      const query = `
      SELECT
        a.id,
        a.type,
        a.appointment_date,
        a.application_id,
        a.is_done,
        ap.first_name AS application_first_name,
        ap.last_name AS application_last_name,
        ap.email AS application_email,
        ap.school_name AS application_school_name,
        ap.course AS application_course,
        ap.hours_needed AS application_hours_needed,
        ap.deployment_date AS application_deployment_date
      FROM appointments a
      LEFT JOIN applications ap ON ap.id = a.application_id
      WHERE a.appointment_date >= $1
        AND a.appointment_date < $2
        AND a.is_done = FALSE
        AND COALESCE(a.is_cancelled, FALSE) = FALSE
      ORDER BY a.appointment_date ASC
    `;

      const values = [startDate, endDate];

      const result = await client.query(query, values);

      return result.rows;
    } catch (error) {
      console.error('[APPOINTMENT] Error fetching appointments:', error);

      throw new InternalServerErrorException('Failed to fetch appointments');
    }
  }
}
