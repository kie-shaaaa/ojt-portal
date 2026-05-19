import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { CourseService } from '../services/courses.service';

@Controller('courses')
export class CoursesController {
  constructor(private readonly courseService: CourseService) {}

  @Get('fetch-all')
  async getAllCourses(@Query('count') count: string) {
    try {
      const limit = parseInt(count, 10) || 10;
      return await this.courseService.getAllCourses(limit);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch courses';
      throw new BadRequestException(message);
    }
  }

  @Post('insert')
  async insertCourse(@Body('course') course: string) {
    try {
      return await this.courseService.insertCourse(course);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to insert course';
      throw new BadRequestException(message);
    }
  }
}
