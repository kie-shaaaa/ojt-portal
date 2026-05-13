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

  async addAppointment(type: AppointmentType, appointmentDate: Date) {
    const client = this.databaseService.getClient();

    try {
      const result = await client.query(
        `
      INSERT INTO appointments (type, appointment_date)
      VALUES ($1, $2)
      RETURNING *
      `,
        [type, appointmentDate],
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
      SELECT *
      FROM appointments
      WHERE appointment_date >= $1
        AND appointment_date < $2
      ORDER BY appointment_date ASC
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
