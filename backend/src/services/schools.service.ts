import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { Schools } from '../data/types';
import { LogsService } from './logs.service';
import { SuccessHandler, throwAppError } from '../utils/handlers';

@Injectable()
export class SchoolService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly logsService: LogsService,
  ) {}
  async getAllSchools(count: number) {
    const client = this.databaseService.getClient();
    try {
      if (count < 1) throwAppError('bad_request', 'Count must be at least 1');

      const res = await client.query<Schools>(
        `
                SELECT * FROM schools LIMIT $1
            `,
        [count],
      );

      return SuccessHandler('Schools fetched successfully', res.rows || []);
    } catch (error) {
      console.error('[SCHOOLS] Error fetching schools:', error);
      throwAppError('server_error', 'Failed to fetch schools');
    }
  }

  async insertSchool(school: string) {
    const client = this.databaseService.getClient();
    try {
      if (!school) throwAppError('bad_request', 'School name is required');

      const res = await client.query(
        `
                INSERT INTO schools (school_name)
                VALUES ($1)
                RETURNING *
            `,
        [school],
      );

      if (res.rowCount === 0)
        throwAppError('server_error', 'Failed to insert school');

      // Log school insertion (system operation)
      await this.logsService
        .logOther({
          userId: 0,
          action: 'School Created',
          details: `School '${school}' has been inserted`,
        })
        .catch((err) => console.error('Failed to log school creation', err));

      return SuccessHandler('School inserted successfully', res.rows[0]);
    } catch (error) {
      console.error('[SCHOOLS] Error inserting school:', error);
      throwAppError('server_error', 'Failed to insert school');
    }
  }
}
