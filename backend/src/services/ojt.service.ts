/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { AllOjt } from '../data/types';
import { SuccessHandler, throwAppError } from '../../utils/handlers';
import { LogsService } from './logs.service';

@Injectable()
export class OjtService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly logsService: LogsService,
  ) {}

  async getOjt(count: number) {
    const client = this.databaseService.getClient();
    try {
      if (count < 1) return null;

      const res = await client.query<AllOjt>(
        `
                SELECT * FROM ojt_data LIMIT $1
            `,
        [count],
      );

      return {
        ok: true,
        message: 'OJT data fetched successfully',
        data: res.rows || [],
      };
    } catch (error: unknown) {
      return {
        error,
        message: 'Failed to fetch OJT data',
        ok: false,
      };
    }
  }

  async transferApplcation(applcationId: string) {
    const client = this.databaseService.getClient();
    try {
      const applicationData = await client.query(
        `
                SELECT * FROM applications WHERE id = $1
            `,
        [applcationId],
      );

      if (applicationData.rows.length === 0) {
        throw new BadRequestException('Application not found');
      }

      const ojtData: any = await client.query(
        `
        INSERT INTO ojt_data (application_type, first_name, last_name, gender, email, phone, school_name, hours_needed, 
        course, deployment_date, end_date, certificate_issuance_date, orientation_date, confirmed_at, confirmation_ip, second_chance,
        submission_date, original_status, moved_to_ojt_at, admin_notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, NOW(), '')
        RETURNING *
         `,
        [
          applicationData.rows[0].application_type,
          applicationData.rows[0].first_name,
          applicationData.rows[0].last_name,
          applicationData.rows[0].gender,
          applicationData.rows[0].email,
          applicationData.rows[0].phone,
          applicationData.rows[0].school_name,
          applicationData.rows[0].hours_needed,
          applicationData.rows[0].course,
          applicationData.rows[0].deployment_date,
          applicationData.rows[0].end_date,
          applicationData.rows[0].certificate_issuance_date,
          applicationData.rows[0].orientation_date,
          applicationData.rows[0].confirmed_at,
          applicationData.rows[0].confirmation_ip,
          applicationData.rows[0].second_chance,
          applicationData.rows[0].submission_date,
          applicationData.rows[0].original_status,
          applicationData.rows[0].moved_to_ojt_at,
          applicationData.rows[0].admin_notes,
        ],
      );

      if (ojtData.rows.length === 0) {
        throw new InternalServerErrorException(
          'Failed to transfer application to OJT',
        );
      }

      // Log application transfer to OJT (system operation)
      await this.logsService
        .logOther({
          userId: 0,
          action: 'Application Transferred to OJT',
          details: `Application ${applcationId} transferred to OJT by ${applicationData.rows[0].first_name} ${applicationData.rows[0].last_name}`,
          ipAddress: undefined,
        })
        .catch((err) => console.error('Failed to log OJT transfer', err));

      return {
        success: true,
        ok: true,
        data: null,
        message: 'Application transferred to OJT successfully',
        error: null,
      };
    } catch (error) {
      console.error('[APPOINTMENT] Error fetching accounts:', error);

      if (
        error instanceof Error &&
        error.message.includes('User already exists')
      ) {
        throw new BadRequestException('User with this email already exists');
      }

      throw new InternalServerErrorException('Failed to fetch user accounts');
    }
  }

  async deleteOjt(id: number) {
    const client = this.databaseService.getClient();

    try {
      const res = await client.query(
        `
        DELETE FROM applications
        WHERE id = $1
        `,
        [id],
      );

      // Log OJT deletion (system operation)
      await this.logsService
        .logOther({
          userId: 0,
          action: 'OJT Record Deleted',
          details: `OJT record ${id} has been deleted`,
          ipAddress: undefined,
        })
        .catch((err) => console.error('Failed to log OJT deletion', err));

      return SuccessHandler('Successfully deleted user', res.rows[0]);
    } catch (error) {
      console.log(`[APPLICATION] error deleting application`, error);
      throwAppError('server_error', 'Error fetching settings');
    }
  }
}
