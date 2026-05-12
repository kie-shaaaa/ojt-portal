import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import {
  Application,
  ApplicationStatus,
  SubmitApplicationResponse,
  GetApplicationsResponse,
  GetApplicationResponse,
  GetApplicationStatusResponse,
} from '../data/types';
import { CreateApplicationDto } from '../data/dto/create-application.dto';

@Injectable()
export class ApplicationsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async submitApplication(
    application: CreateApplicationDto,
  ): Promise<SubmitApplicationResponse> {
    const client = this.databaseService.getClient();
    const exists = await client.query(
      'SELECT id FROM applications WHERE email = $1',
      [application.email],
    );

    if (exists.rows.length > 0) {
      throw new Error('You already submitted an application!');
    }

    const res = await client.query<Application>(
      `
        INSERT INTO applications (
          application_type, other_application_type, first_name, last_name, email, phone,
          school_name, hours_needed, course, deployment_date,
          position_applied, years_experience, current_company, salary_expectation, available_date,
          agreed_terms, submission_date, status
        )
        VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10,
          $11, $12, $13, $14, $15,
          $16, CURRENT_TIMESTAMP, 'pending'
        )
        RETURNING *
      `,
      [
        application.application_type,
        application.other_application_type,
        application.first_name,
        application.last_name,
        application.email,
        application.phone,
        application.school_name,
        application.hours_needed,
        application.course,
        application.deployment_date,
        application.position_applied,
        application.years_experience,
        application.current_company,
        application.salary_expectation,
        application.available_date,
        application.agreed_terms,
      ],
    );

    return {
      ok: true,
      message: 'Application submitted successfully',
      data: res.rows[0],
    };
  }

  async getApplications(count: number): Promise<GetApplicationsResponse> {
    const client = this.databaseService.getClient();
    if (count < 1) {
      return null;
    }

    const res = await client.query<Application>(
      `
      SELECT * FROM applications LIMIT $1
      `,
      [count],
    );

    return res.rows || [];
  }

  async getApplicationByIdOrEmail(
    id?: number,
    email?: string,
  ): Promise<GetApplicationResponse> {
    const client = this.databaseService.getClient();

    const res = await client.query<Application>(
      `
      SELECT * FROM applications
      WHERE email = $1 OR id = $2
      `,
      [email || '', id || null],
    );

    return res.rows || [];
  }

  async getApplicationByStatus(
    status: ApplicationStatus,
  ): Promise<GetApplicationStatusResponse> {
    const client = this.databaseService.getClient();

    const res = await client.query<Application>(
      `
      SELECT * FROM applications
      WHERE status = $1;
      `,
      [status],
    );

    return res.rows[0] ?? null;
  }

  async updateApplication(
    id: number,
    status: ApplicationStatus,
  ): Promise<GetApplicationStatusResponse> {
    const client = this.databaseService.getClient();

    const res = await client.query<Application>(
      `
      UPDATE applications
      SET status = $1
      WHERE id = $2
      RETURNING *;
      `,
      [status, id],
    );

    return res.rows[0] ?? null;
  }

  async getPendingCount(): Promise<number> {
    const client = this.databaseService.getClient();

    const res = await client.query<{ count: string }>(
      `
      SELECT COUNT(*) as count FROM applications
      WHERE status = 'pending'
      `,
    );

    return parseInt(res.rows[0]?.count || '0', 10);
  }
}
