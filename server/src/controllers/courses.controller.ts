import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { CourseService } from '../services/courses.service';

@Controller('courses')
export class CoursesController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  async getAllCourses(@Query('count') count: string) {
    const limit = parseInt(count, 10) || 10;
    return await this.courseService.getAllCourses(limit);
  }

  @Post()
  async insertCourse(@Body('course') course: string) {
    return await this.courseService.insertCourse(course);
  }
}
