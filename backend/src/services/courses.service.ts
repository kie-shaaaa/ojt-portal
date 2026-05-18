import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { Courses } from '../data/types';
import { LogsService } from './logs.service';

@Injectable()
export class CourseService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly logsService: LogsService,
  ) {}
  async getAllCourses(count: number) {
    const client = this.databaseService.getClient();
    try {
      if (count < 1) return null;

      const res = await client.query<Courses>(
        `
                SELECT * FROM courses LIMIT $1
            `,
        [count],
      );

      return {
        ok: true,
        message: 'Courses data fetched successfully',
        data: res.rows || [],
      };
    } catch (error: unknown) {
      return {
        error,
        message: 'Failed to fetch Courses Data',
        ok: false,
      };
    }
  }

  async insertCourse(course: string) {
    const client = this.databaseService.getClient();
    try {
      if (!course) return null;

      const inser = await client.query(
        `
                INSERT INTO courses (course_name)
                VALUES ($1)
                RETURN *
            `,
        [course],
      );

      // Log course insertion (system operation)
      await this.logsService
        .logOther({
          userId: 0,
          action: 'Course Created',
          details: `Course '${course}' has been inserted`,
          ipAddress: undefined,
        })
        .catch((err) => console.error('Failed to log course creation', err));

      return {
        ok: true,
        message: 'Course has been inserted',
      };
    } catch (error: unknown) {
      return {
        error,
        message: 'Failed to insert Course Data',
        ok: false,
      };
    }
  }
}
