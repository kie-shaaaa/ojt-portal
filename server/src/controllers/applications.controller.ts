import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApplicationsService } from '../services/applications.service';
import { CreateApplicationDto } from '../data/create-application.dto';
import type { ApplicationStatus } from '../data/types';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationService: ApplicationsService) {}

  @Get('/fetch-all')
  async getApplications(@Query('count') count?: string) {
    return await this.applicationService.getApplications(Number(count) || 0);
  }

  @Get('/fetch')
  async getApplicationByIdOrEmail(
    @Query('id') id?: string,
    @Query('email') email?: string,
  ) {
    return await this.applicationService.getApplicationByIdOrEmail(
      Number(id),
      email || '',
    );
  }

  @Get('/calendar')
  async getApplicationForInterview() {  
    return await this.applicationService.getApplicationByStatus(
      'for_interview',
    );
  }

  @Get('/status')
  async getApplicationByStatus(@Query('status') status?: ApplicationStatus) {
    if (!status)
      throw new BadRequestException('Status required to fetch applications');
    return await this.applicationService.getApplicationByStatus(status);
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
  @Patch('/update')
  async updateApplication(
    @Body() id: number,
    @Body() status: ApplicationStatus,
  ) {
    try {
      const result = await this.applicationService.updateApplication(
        id,
        status,
      );
      return result;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
