import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { SchoolService } from '../services/schools.service';

@Controller('schools')
export class SchoolsController {
  constructor(private readonly schoolService: SchoolService) {}

  @Get('fetch-all')
  async getAllSchools(@Query('count') count: string) {
    try {
      const limit = parseInt(count, 10) || 10;
      return await this.schoolService.getAllSchools(limit);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch schools';
      throw new BadRequestException(message);
    }
  }

  @Post('insert-school')
  async insertSchool(@Body('school') school: string) {
    try {
      return await this.schoolService.insertSchool(school);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to insert school';
      throw new BadRequestException(message);
    }
  }
}
