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
import type {
  ApplicationStatus,
  GetApplicationsResponse,
  GetApplicationResponse,
  GetApplicationStatusResponse,
  SubmitApplicationResponse,
} from '../data/types';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationService: ApplicationsService) {}

  @Get('/fetch-all')
  async getApplications(
    @Query('count') count?: string,
  ): Promise<GetApplicationsResponse> {
    try {
      return await this.applicationService.getApplications(Number(count) || 0);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch applications';
      throw new BadRequestException(message);
    }
  }

  @Get('/fetch')
  async getApplicationByIdOrEmail(
    @Query('id') id?: string,
    @Query('email') email?: string,
  ): Promise<GetApplicationResponse> {
    try {
      return await this.applicationService.getApplicationByIdOrEmail(
        Number(id),
        email || '',
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch application';
      throw new BadRequestException(message);
    }
  }

  @Get('/calendar')
  async getApplicationForInterview(): Promise<GetApplicationStatusResponse> {
    try {
      return await this.applicationService.getApplicationByStatus(
        'for_interview',
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to fetch calendar applications';
      throw new BadRequestException(message);
    }
  }

  @Get('/status')
  async getApplicationByStatus(
    @Query('status') status?: ApplicationStatus,
  ): Promise<GetApplicationStatusResponse> {
    if (!status)
      throw new BadRequestException('Status required to fetch applications');
    try {
      return await this.applicationService.getApplicationByStatus(status);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch applications';
      throw new BadRequestException(message);
    }
  }

  @Post('/submit')
  async submitApplication(
    @Body() createApplicationDto: CreateApplicationDto,
  ): Promise<SubmitApplicationResponse> {
    try {
      const result =
        await this.applicationService.submitApplication(createApplicationDto);
      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to submit application';
      throw new BadRequestException(message);
    }
  }
  @Patch('/update')
  async updateApplication(
    @Body() id: number,
    @Body() status: ApplicationStatus,
  ): Promise<GetApplicationStatusResponse> {
    try {
      const result = await this.applicationService.updateApplication(
        id,
        status,
      );
      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to update application';
      throw new BadRequestException(message);
    }
  }
}
