import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { Courses } from '../data/types';
import { LogsService } from './logs.service';
import { SuccessHandler, throwAppError } from '../utils/handlers';

@Injectable()
export class CourseService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly logsService: LogsService,
  ) {}
  async getAllCourses(count: number) {
    const client = this.databaseService.getClient();
    try {
      if (count < 1) throwAppError('bad_request', 'Count must be at least 1');

      const res = await client.query<Courses>(
        `
                SELECT * FROM courses LIMIT $1
            `,
        [count],
      );

      return SuccessHandler('Courses fetched successfully', res.rows || []);
    } catch (error) {
      console.error('[COURSES] Error fetching courses:', error);
      throwAppError('server_error', 'Failed to fetch courses');
    }
  }

  async insertCourse(course: string) {
    const client = this.databaseService.getClient();
    try {
      if (!course) throwAppError('bad_request', 'Course name is required');

      const res = await client.query(
        `
                INSERT INTO courses (course_name)
                VALUES ($1)
                RETURNING *
            `,
        [course],
      );

      if (res.rowCount === 0)
        throwAppError('server_error', 'Failed to insert course');

      // Log course insertion (system operation)
      await this.logsService
        .logOther({
          userId: 0,
          action: 'Course Created',
          details: `Course '${course}' has been inserted`,
        })
        .catch((err) => console.error('Failed to log course creation', err));

      return SuccessHandler('Course inserted successfully', res.rows[0]);
    } catch (error) {
      console.error('[COURSES] Error inserting course:', error);
      throwAppError('server_error', 'Failed to insert course');
    }
  }
}
