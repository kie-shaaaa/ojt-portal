import { BadRequestException, Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApplicationsService } from '../services/applications.service';
import { CreateApplicationDto } from '../data/create-application.dto';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationService: ApplicationsService) {}

  @Get('/fetch-all')
  async getApplications(@Query('count') count?: string) {
    return this.applicationService.getApplications(Number(count) || 0);
  }

  @Post('/submit')
  async submitApplication(@Body() createApplicationDto: CreateApplicationDto) {
    try {
      const result =
        await this.applicationService.submitApplication(createApplicationDto);
      return result;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  @Get('/fetch')
  async getApplicationByIdOrEmail(
    @Query('id') id?: string,
    @Query('email') email?: string,
  ) {
    return this.applicationService.getApplicationByIdOrEmail(
      Number(id),
      email || '',
    );
  }
}
