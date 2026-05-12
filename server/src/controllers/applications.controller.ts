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
import { CreateApplicationDto } from '../data/dto/create-application.dto';
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

  /**
   * Paginated fetching of applicants
   * @param count string, param string converted to number
   * @returns array of applicants
   * */
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

  /**  Singular fetching of user via two parameters, mainly used for application tracking
   * @param id string, param id converted to number
   * @param email string, email of the applicant
   * @returns single array of an applicant
   */
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

  /**
   * Used to fetch data for the calendar display
   * @returns applicants with an application status of "for_interview"
   */
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

  /**
   * Can be used for calendar aswell but more flexible for different target status of applicant
   * @param status string/enum of ApplicationStatus
   * @returns array of applicants based on the sent parameter
   */
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

  /**
   * Submission of applications with proper validation
   * TODO - File bucket and validation (for service)
   * @param createApplicationDto
   * @returns application status (successful or not)
   */

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

  /**
   * Generally used for correcting wrong information
   * Mainly used for resubmitting files that are invalid or requires additional information (ie. MOA/MOU)
   * @param id
   * @param status
   * @returns
   */
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
