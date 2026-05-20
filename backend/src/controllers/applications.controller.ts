import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../data/guards/roles.guard';
import { plainToInstance } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';
import type { FastifyRequest } from 'fastify';
import { ApplicationsService } from '../services/applications.service';
import { FileUploadsService } from '../services/file-uploads.service';
import { CreateApplicationDto } from '../data/dto/create-application.dto';
import { UploadedFile } from '../data/types/file-upload.types';
import type {
  ApplicationStatus,
  UpdateApplicationSettingsDto,
  SuccessResponse,
} from '../data/types';
import type { UpdateApplicationDto } from '../data/interfaces';
import * as tmp from 'tmp';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';

@Controller('applications')
export class ApplicationsController {
  constructor(
    private readonly applicationService: ApplicationsService,
    private readonly fileUploadsService: FileUploadsService,
  ) {}

  /**
   * Paginated fetching of applicants
   * @param count string, param string converted to number
   * @returns array of applicants
   * */
  @Get('fetch-all')
  async getApplications(
    @Query('count') count?: string,
  ): Promise<SuccessResponse> {
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
  @Get('fetch')
  async getApplicationByIdOrEmail(
    @Query('id') id?: string,
    @Query('email') email?: string,
  ): Promise<SuccessResponse> {
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
  @Get('calendar')
  async getApplicationForInterview(): Promise<SuccessResponse> {
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
  @Get('status')
  async getApplicationByStatus(
    @Query('status') status?: ApplicationStatus,
  ): Promise<SuccessResponse> {
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
   * Fetch settings for application_settings
   */
  @Get('settings')
  async getSettings() {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this.applicationService.getSettings();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch settings';
      throw new BadRequestException(message);
    }
  }

  /**
   * Update settings for application_settings
   */
  @Post('settings')
  async updateApplicationSettings(
    @Body() updateSettings: UpdateApplicationSettingsDto,
  ) {
    try {
      return this.applicationService.updateApplicationSettings(updateSettings);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to update settings';
      throw new BadRequestException(message);
    }
  }

  /**
   * Submission of applications with proper validation
   * TODO - File bucket and validation (for service)
   * @param createApplicationDto
   * @returns application status (successful or not)
   */

  @Post('submit')
  async submitApplication(
    @Req() request: FastifyRequest,
  ): Promise<SuccessResponse> {
    try {
      const contentType = String(request.headers['content-type'] ?? '');

      if (!contentType.includes('multipart/form-data')) {
        const application = await this.parseApplicationPayload(request.body);
        return await this.applicationService.submitApplication(application);
      }

      const { application, files } =
        await this.parseMultipartSubmission(request);
      return await this.applicationService.submitApplicationWithFiles(
        application,
        files,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to submit application';
      throw new BadRequestException(message);
    }
  }

  private async parseMultipartSubmission(
    request: FastifyRequest,
  ): Promise<{ application: CreateApplicationDto; files: UploadedFile[] }> {
    const fields: Record<string, string> = {};
    const files: UploadedFile[] = [];

    const multipartRequest = request as FastifyRequest & {
      parts: () => AsyncIterable<{
        type: 'file' | 'field';
        fieldname: string;
        filename: string;
        encoding: string;
        mimetype: string;
        value?: string;
        file: import('stream').Readable;
      }>;
    };

    for await (const part of multipartRequest.parts()) {
      if (part.type === 'file') {
        if (!part.file) {
          throw new BadRequestException(
            `Unable to read uploaded file ${part.fieldname}`,
          );
        }

        const tempFile = tmp.fileSync({
          postfix: `-${part.filename}`,
          keep: true,
        });
        const writeStream = createWriteStream(tempFile.name);

        let fileSize = 0;

        part.file.on('data', (chunk: Buffer) => {
          fileSize += chunk.length;
        });

        try {
          // 2. Stream directly from network to temp file path
          await pipeline(part.file, writeStream);

          files.push({
            fieldname: part.fieldname,
            originalname: part.filename,
            encoding: part.encoding,
            mimetype: part.mimetype,
            path: tempFile.name, // Local disk path
            size: fileSize,
            cleanup: () => {
              try {
                tempFile.removeCallback();
              } catch {}
            },
          });
        } catch (streamError: any) {
          throw new BadRequestException(
            `File upload failed mid-stream: ${streamError.message}`,
          );
        }
      } else {
        fields[part.fieldname] = String(part.value ?? '');
      }
    }

    const application = plainToInstance(
      CreateApplicationDto,
      this.normalizeSubmissionFields(fields),
      {
        enableImplicitConversion: true,
      },
    );

    try {
      await validateOrReject(application);
    } catch (validationError) {
      throw new BadRequestException(
        this.formatValidationErrors(validationError as ValidationError[]),
      );
    }

    return { application, files };
  }

  private async parseApplicationPayload(
    body: unknown,
  ): Promise<CreateApplicationDto> {
    const payload =
      body && typeof body === 'object' ? (body as Record<string, unknown>) : {};

    const application = plainToInstance(
      CreateApplicationDto,
      this.normalizeSubmissionFields(payload),
      {
        enableImplicitConversion: true,
      },
    );

    try {
      await validateOrReject(application);
    } catch (validationError) {
      throw new BadRequestException(
        this.formatValidationErrors(validationError as ValidationError[]),
      );
    }

    return application;
  }

  private normalizeSubmissionFields(
    input: Record<string, unknown>,
  ): Record<string, unknown> {
    return {
      ...input,
      application_type:
        typeof input.application_type === 'string'
          ? input.application_type.trim()
          : input.application_type,
      other_application_type:
        typeof input.other_application_type === 'string'
          ? input.other_application_type.trim()
          : input.other_application_type,
      first_name:
        typeof input.first_name === 'string'
          ? input.first_name.trim()
          : input.first_name,
      last_name:
        typeof input.last_name === 'string'
          ? input.last_name.trim()
          : input.last_name,
      email: typeof input.email === 'string' ? input.email.trim() : input.email,
      phone: typeof input.phone === 'string' ? input.phone.trim() : input.phone,
      school_name:
        typeof input.school_name === 'string'
          ? input.school_name.trim()
          : input.school_name,
      course:
        typeof input.course === 'string' ? input.course.trim() : input.course,
      deployment_date:
        typeof input.deployment_date === 'string'
          ? input.deployment_date.trim()
          : input.deployment_date,
      position_applied:
        typeof input.position_applied === 'string'
          ? input.position_applied.trim()
          : input.position_applied,
      current_company:
        typeof input.current_company === 'string'
          ? input.current_company.trim()
          : input.current_company,
      agreed_terms:
        input.agreed_terms === true ||
        input.agreed_terms === 'true' ||
        input.agreed_terms === 'on' ||
        input.agreed_terms === '1',
    };
  }

  private formatValidationErrors(errors: ValidationError[]): string {
    const messages = errors.flatMap((error) =>
      error.constraints ? Object.values(error.constraints) : [],
    );

    return messages[0] ?? 'Invalid application submission';
  }

  /**
   * Generally used for correcting wrong information
   * Mainly used for resubmitting files that are invalid or requires additional information (ie. MOA/MOU)
   * @param id
   * @param status
   * @returns
   */
  @Patch('update')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async updateStatus(
    @Body() body: UpdateApplicationDto,
    @Req() req: FastifyRequest & { user?: any },
  ) {
    try {
      const userId = req.user?.id;
      return this.applicationService.updateApplicationStatus(
        body.id,
        body.status,
        body.interviewDate,
        body.interviewTime,
        body.acceptedDate,
        body.acceptedTime,
        body.interviewLocation,
        body.adminNote,
        userId,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to update application';
      throw new BadRequestException(message);
    }
  }

  /**
   * Get notifications/pending count endpoint
   * @returns count of pending applications
   */
  @Get('notifications')
  async getNotifications(): Promise<{ count: number }> {
    try {
      const count = await this.applicationService.getPendingCount();
      return { count };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to fetch pending count';
      throw new BadRequestException(message);
    }
  }

  @Delete('delete')
  async deleteApplication(@Body() id: number): Promise<SuccessResponse> {
    try {
      return await this.applicationService.deleteApplication(id);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to delete application';
      throw new BadRequestException(message);
    }
  }

  /**
   * Fetch all files for an application with signed URLs
   * @param id application ID
   * @returns array of files with metadata and signed URLs
   */
  @Get(':id/files')
  async getApplicationFiles(@Param('id') id: string): Promise<
    Array<{
      id: number;
      application_id: number;
      file_type: string;
      document_key: string | null;
      file_name: string;
      file_extension: string;
      file_path: string;
      file_size: number;
      uploaded_at: string;
      signedUrl: string;
    }>
  > {
    try {
      const applicationId = Number(id);
      if (!applicationId) {
        throw new BadRequestException('Application ID is required');
      }

      const files =
        await this.fileUploadsService.getApplicationFiles(applicationId);

      // Enrich files with signed URLs for download
      const enrichedFiles = await Promise.all(
        files.map(async (file) => ({
          ...file,
          signedUrl: await this.fileUploadsService.getSignedUrl(
            file.file_path,
            3600, // 1 hour expiry
          ),
        })),
      );

      return enrichedFiles;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch files';
      throw new BadRequestException(message);
    }
  }

  @Post('reject-file')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async rejectFile(
    @Body() body: { fileId: number },
    @Req() req: FastifyRequest & { user?: any },
  ) {
    const userId = req.user?.id;
    if (!body.fileId) throw new BadRequestException('FileId is missing');
    try {
      return this.fileUploadsService.deleteFile(body.fileId, userId);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to reject the file';
      throw new BadRequestException(message);
    }
  }

  /**
   * Resubmit application files after rejection
   * @param id application ID from URL param
   * @param request FastifyRequest for multipart parsing
   * @returns success response with updated application
   */
  @Post(':id/resubmit-files')
  async resubmitApplicationFiles(
    @Param('id') id: string,
    @Req() request: FastifyRequest,
  ): Promise<SuccessResponse> {
    try {
      const applicationId = Number(id);
      if (!Number.isFinite(applicationId) || applicationId <= 0) {
        throw new BadRequestException('Invalid application ID');
      }

      const contentType = String(request.headers['content-type'] ?? '');
      if (!contentType.includes('multipart/form-data')) {
        throw new BadRequestException('Expected multipart/form-data');
      }

      const { fields, files } = await this.parseResubmissionMultipart(request);
      return await this.applicationService.resubmitApplicationFiles(
        applicationId,
        fields,
        files,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to resubmit application files';
      throw new BadRequestException(message);
    }
  }

  private async parseResubmissionMultipart(request: FastifyRequest): Promise<{
    fields: Record<string, string>;
    files: UploadedFile[];
  }> {
    const fields: Record<string, string> = {};
    const files: UploadedFile[] = [];

    const multipartRequest = request as FastifyRequest & {
      parts: () => AsyncIterable<{
        type: 'file' | 'field';
        fieldname: string;
        filename: string;
        encoding: string;
        mimetype: string;
        value?: string;
        file: import('stream').Readable;
      }>;
    };

    for await (const part of multipartRequest.parts()) {
      if (part.type === 'file') {
        if (!part.file) {
          throw new BadRequestException(
            `Unable to read uploaded file ${part.fieldname}`,
          );
        }

        const tempFile = tmp.fileSync({
          postfix: `-${part.filename}`,
          keep: true,
        });
        const writeStream = createWriteStream(tempFile.name);

        let fileSize = 0;

        part.file.on('data', (chunk: Buffer) => {
          fileSize += chunk.length;
        });

        try {
          await pipeline(part.file, writeStream);

          files.push({
            fieldname: part.fieldname,
            originalname: part.filename,
            encoding: part.encoding,
            mimetype: part.mimetype,
            path: tempFile.name,
            size: fileSize,
            cleanup: () => {
              try {
                tempFile.removeCallback();
              } catch {}
            },
          });
        } catch (streamError: any) {
          throw new BadRequestException(
            `File upload failed mid-stream: ${streamError.message}`,
          );
        }
      } else {
        fields[part.fieldname] = String(part.value ?? '');
      }
    }

    return { fields, files };
  }
}
