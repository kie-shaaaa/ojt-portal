import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { SchoolService } from '../services/schools.service';

@Controller('schools')
export class SchoolsController {
  constructor(private readonly schoolService: SchoolService) {}

  @Get('fetch-all')
  async getAllSchools(@Query('count') count: string) {
    const limit = parseInt(count, 10) || 10;
    return await this.schoolService.getAllSchools(limit);
  }

  @Post('insert-school')
  async insertSchool(@Body('school') school: string) {
    return await this.schoolService.insertSchool(school);
  }
}
