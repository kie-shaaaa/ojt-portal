import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { FileUploadsService } from './file-uploads.service';
import {
  Application,
  ApplicationStatus,
  UpdateApplicationSettingsDto,
  SuccessResponse,
  AllOjt,
} from '../data/types';
import { CreateApplicationDto } from '../data/dto/create-application.dto';
import { UploadedFile } from '../data/types/file-upload.types';
import { SuccessHandler, throwAppError } from '../../utils/handlers';
import { MailerService } from './mailer.service';
import { LogsService } from './logs.service';
import { AppointmentsService } from './appointments.service';

@Injectable()
export class ApplicationsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly fileUploadsService: FileUploadsService,
    private readonly mailerService: MailerService,
    private readonly logsService: LogsService,
    private readonly appointmentsService: AppointmentsService,
  ) {}

  async submitApplication(
    application: CreateApplicationDto,
  ): Promise<SuccessResponse> {
    const client = this.databaseService.getClient();
    try {
      const exists = await client.query(
        'SELECT id FROM applications WHERE email = $1',
        [application.email],
      );

      if (exists.rows.length > 0) {
        throw new Error('You already submitted an application!');
      }

      const res = await client.query<Application>(
        `
        INSERT INTO applications (
          application_type, other_application_type, first_name, last_name, email, phone,
          school_name, hours_needed, course, deployment_date,
          position_applied, years_experience, current_company, salary_expectation, available_date,
          agreed_terms, submission_date, status
        )
        VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10,
          $11, $12, $13, $14, $15,
          $16, CURRENT_TIMESTAMP, 'pending'
        )
        RETURNING *
      `,
        [
          application.application_type,
          application.other_application_type,
          application.first_name,
          application.last_name,
          application.email,
          application.phone,
          application.school_name,
          application.hours_needed,
          application.course,
          application.deployment_date,
          application.position_applied,
          application.years_experience,
          application.current_company,
          application.salary_expectation,
          application.available_date,
          application.agreed_terms,
        ],
      );

      if (res.rowCount === 0) {
        throwAppError(
          'bad_request',
          'Application did not return for submission',
        );
      }

      const data = res.rows[0];

      const confirmationDto = {
        to: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
        applicationId: data.id,
        applicationType: data.application_type,
      };

      const mailed =
        await this.mailerService.confirmationEmail(confirmationDto);

      if (!mailed) throwAppError('server_error', 'Failed to email user');

      return SuccessHandler('Application submitted successfully', res.rows[0]);
    } catch (error) {
      console.error('[APPLICATION] Error submitting application', error);
      throwAppError('server_error', 'Server error, try again later');
    }
  }

  async submitApplicationWithFiles(
    application: CreateApplicationDto,
    files: UploadedFile[] = [],
  ): Promise<SuccessResponse> {
    const client = this.databaseService.getClient();
    const exists = await client.query(
      'SELECT id FROM applications WHERE email = $1',
      [application.email],
    );

    if (exists.rows.length > 0) {
      throw new Error('You already submitted an application!');
    }

    const res = await client.query<Application>(
      `
        INSERT INTO applications (
          application_type, other_application_type, first_name, last_name, email, phone,
          school_name, hours_needed, course, deployment_date,
          position_applied, years_experience, current_company, salary_expectation, available_date,
          agreed_terms, submission_date, status
        )
        VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10,
          $11, $12, $13, $14, $15,
          $16, CURRENT_TIMESTAMP, 'pending'
        )
        RETURNING *
      `,
      [
        application.application_type,
        application.other_application_type,
        application.first_name,
        application.last_name,
        application.email,
        application.phone,
        application.school_name,
        application.hours_needed,
        application.course,
        application.deployment_date,
        application.position_applied,
        application.years_experience,
        application.current_company,
        application.salary_expectation,
        application.available_date,
        application.agreed_terms,
      ],
    );

    const createdApplication = res.rows[0];
    const uploadedFileIds: number[] = [];

    try {
      for (const file of files) {
        // support disk-backed files (path) or in-memory buffers
        const uploadedFile = await this.fileUploadsService.uploadAndSave(file, {
          application_id: createdApplication.id,
          file_type: 'other',
          document_key: file.fieldname,
          file_name: file.originalname,
          file_size: file.size,
        });

        uploadedFileIds.push(uploadedFile.id);
      }
      const data = res.rows[0];

      const confirmationDto = {
        to: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
        applicationId: data.id,
        applicationType: data.application_type,
      };

      const mailed =
        await this.mailerService.confirmationEmail(confirmationDto);

      if (!mailed) throwAppError('server_error', 'Failed to email user');

      return SuccessHandler(
        'Application submitted successfully',
        createdApplication,
      );
    } catch (error) {
      await Promise.all(
        uploadedFileIds.map((fileId) =>
          this.fileUploadsService.deleteApplicationFile(fileId),
        ),
      ).catch(() => undefined);

      await client.query('DELETE FROM applications WHERE id = $1', [
        createdApplication.id,
      ]);
      throw error;
    } finally {
      // Always attempt to cleanup temp files produced by controller
      await Promise.allSettled(
        files.map((f) => Promise.resolve().then(() => f.cleanup?.())),
      );
    }
  }

  async resubmitApplicationFiles(
    applicationId: number,
    fields: Record<string, string>,
    files: UploadedFile[] = [],
  ): Promise<SuccessResponse> {
    const client = this.databaseService.getClient();

    try {
      // Step 1: Verify the application exists
      const appResult = await client.query<Application>(
        'SELECT * FROM applications WHERE id = $1',
        [applicationId],
      );

      if (appResult.rows.length === 0) {
        throw new Error('Application not found');
      }

      const application = appResult.rows[0];
      const uploadedFileIds: number[] = [];

      try {
        // Step 2: Upload new files, each with its fieldname as the document_key
        for (const file of files) {
          const uploadedFile = await this.fileUploadsService.uploadAndSave(
            file,
            {
              application_id: applicationId,
              file_type: 'other',
              document_key: file.fieldname,
              file_name: file.originalname,
              file_size: file.size,
            },
          );

          uploadedFileIds.push(uploadedFile.id);
        }

        // Log resubmission (system operation)
        await this.logsService
          .logOther({
            userId: 0,
            action: 'Application Resubmitted with Files',
            details: `Application resubmitted with ${files.length} file(s) by ${application.email}`,
          })
          .catch((err) =>
            console.error('Failed to log application resubmission', err),
          );

        return SuccessHandler(
          'Application files resubmitted successfully',
          application,
        );
      } catch (error) {
        // Cleanup uploaded files on error
        await Promise.all(
          uploadedFileIds.map((fileId) =>
            this.fileUploadsService.deleteApplicationFile(fileId),
          ),
        ).catch(() => undefined);

        throw error;
      } finally {
        // Always attempt to cleanup temp files
        await Promise.allSettled(
          files.map((f) => Promise.resolve().then(() => f.cleanup?.())),
        );
      }
    } catch (error) {
      console.error('[APPLICATIONS] Error resubmitting files:', error);
      throw error;
    }
  }

  async getApplications(count: number): Promise<SuccessResponse> {
    const client = this.databaseService.getClient();
    try {
      if (count < 1) throwAppError('bad_request', 'Count must be at least 1');

      const res = await client.query<Application>(
        `
      SELECT * FROM applications LIMIT $1
      `,
        [count],
      );

      return SuccessHandler(
        'Applications fetched successfully',
        res.rows || [],
      );
    } catch (error) {
      console.error('[APPLICATIONS] Error fetching applications:', error);
      throwAppError('server_error', 'Failed to fetch applications');
    }
  }

  async getApplicationByIdOrEmail(
    id?: number,
    email?: string,
  ): Promise<SuccessResponse> {
    const client = this.databaseService.getClient();
    try {
      // If both id and email are provided, perform a strict match (id AND email).
      // This enforces proper verification when callers supply both fields.
      if (id && email) {
        const res = await client.query<Application>(
          `
        SELECT * FROM applications
        WHERE id = $1 AND LOWER(email) = LOWER($2)
        `,
          [id, email],
        );

        return SuccessHandler(
          'Application fetched successfully',
          res.rows || [],
        );
      }

      // Fallback: if one of the params is missing, preserve existing behavior (OR match)
      const res = await client.query<Application>(
        `
      SELECT * FROM applications
      WHERE email = $1 OR id = $2
      `,
        [email || '', id || null],
      );

      return SuccessHandler('Application fetched successfully', res.rows || []);
    } catch (error) {
      console.error('[APPLICATIONS] Error fetching application:', error);
      throwAppError('server_error', 'Failed to fetch application');
    }
  }

  async getApplicationByStatus(
    status: ApplicationStatus,
  ): Promise<SuccessResponse> {
    const client = this.databaseService.getClient();
    try {
      const res = await client.query<Application>(
        `
    SELECT * FROM applications
    WHERE status = $1;
    `,
        [status],
      );

      return SuccessHandler('Application fetched successfully', res.rows[0]);
    } catch (error) {
      console.log(`[APPLICATION] error fetching settings`, error);
      throwAppError('server_error', 'Error fetching settings');
    }
  }

  // Update Application Settings
  async updateApplicationSettings(settings: UpdateApplicationSettingsDto) {
    const client = this.databaseService.getClient();
    try {
      const { portal_status, opening_date, closing_date, created_by } =
        settings;

      const res = await client.query(
        `
              INSERT INTO application_settings (
              portal_status,
              opening_date,
              closing_date,
              created_by
            )
            VALUES ($1, $2, $3, $4)
            RETURNING
              id,
              portal_status,
              opening_date,
              closing_date,
              created_by,
              created_at,
              updated_at;
            `,
        [portal_status, opening_date || null, closing_date || null, created_by],
      );

      return SuccessHandler('Settings updated successfully', res.rows[0]);
    } catch (error) {
      console.log(`[APPLICATION | SETTINGS] error updating settings`, error);
      throwAppError('server_error', 'Error updating settings');
    }
  }

  // Fetch Application Settings
  async getSettings() {
    const client = this.databaseService.getClient();
    try {
      const settings = await client.query(
        `
      SELECT * FROM application_settings ORDER BY created_at DESC LIMIT 1;
      `,
      );

      if (!settings.rows[0]) {
        throwAppError('not_found', 'No application settings found');
      }

      return SuccessHandler('Settings fetched successfully', settings.rows[0]);
    } catch (error) {
      console.error('[APPLICATIONS] Error fetching settings:', error);
      throwAppError('server_error', 'Failed to fetch settings');
    }
  }

  async updateApplicationStatus(
    id: number,
    status: ApplicationStatus,
    interviewDate?: string,
    interviewTime?: string,
    acceptedDate?: string,
    acceptedTime?: string,
    interviewLocation?: string,
    adminNote?: string,
    userId?: number,
  ): Promise<SuccessResponse> {
    const client = this.databaseService.getClient();

    try {
      const exists = await client.query<Application>(
        `
              SELECT * FROM applications
              WHERE id = $1
              `,
        [id],
      );

      if (exists.rowCount === 0) {
        throwAppError('not_found', 'Application not found');
      }

      const data = exists.rows[0];

      await client.query('BEGIN');

      // 1. Update application and return updated row
      const res = await client.query<Application>(
        `
        UPDATE applications
        SET status = $1
        WHERE id = $2
        RETURNING *;
      `,
        [status, id],
      );

      const application = res.rows[0];

      if (!application) {
        throw new Error('Application not found');
      }

      // Log application status change
      const oldStatus = data.status;
      const newStatus = status;
      await this.logsService
        .logApplicationStatusChange({
          userId: userId,
          oldStatus: oldStatus,
          newStatus: newStatus,
        })
        .catch((err) =>
          console.error('Failed to log application status change', err),
        );

      // Log admin notes if provided
      if (adminNote) {
        await this.logsService
          .logAdminNotesAdded({
            userId: userId,
            notes: adminNote,
          })
          .catch((err) => console.error('Failed to log admin notes', err));
      }

      if (status === 'pending accept') {
        const existingOjt = await client.query(
          `
          UPDATE ojt_data
          SET
            application_type = $2,
            first_name = $3,
            last_name = $4,
            phone = $5,
            school_name = $6,
            hours_needed = $7,
            course = $8,
            deployment_date = $9,
            moved_to_ojt_at = CURRENT_TIMESTAMP
          WHERE email = $1
          RETURNING id
          `,
          [
            application.email,
            application.application_type,
            application.first_name,
            application.last_name,
            application.phone,
            application.school_name,
            application.hours_needed,
            application.course,
            application.deployment_date,
          ],
        );

        if (existingOjt.rowCount === 0) {
          await client.query<AllOjt>(
            `
            INSERT INTO ojt_data (
              application_type,
              first_name,
              last_name,
              email,
              phone,
              school_name,
              hours_needed,
              course,
              deployment_date,
              moved_to_ojt_at
            )
            VALUES (
              $1, $2, $3, $4, $5,
              $6, $7, $8, $9,
              CURRENT_TIMESTAMP
            )
          `,
            [
              application.application_type,
              application.first_name,
              application.last_name,
              application.email,
              application.phone,
              application.school_name,
              application.hours_needed,
              application.course,
              application.deployment_date,
            ],
          );
        }
      }

      // 2. If accepted → move confirmed_at is stamped
      if (status === 'accepted') {
        await client.query<AllOjt>(
          `
            UPDATE ojt_data
            SET confirmed_at = CURRENT_TIMESTAMP
            WHERE email = $1
          `,
          [application.email],
        );
      }

      if (status === 'for_interview') {
        // If interview date/time provided, create an interview appointment
        try {
          if (interviewDate) {
            const interviewDateTime = interviewTime
              ? new Date(`${interviewDate}T${interviewTime}`)
              : new Date(interviewDate);

            await this.appointmentsService.addAppointment(
              'interview',
              interviewDateTime,
              id,
            );
          }
        } catch (err) {
          console.error('Failed to create interview appointment', err);
        }

        const mailSent = await this.mailerService.responseEmail({
          to: data.email,
          firstName: data.first_name,
          lastName: data.last_name,
          applicationId: id,
          status: 'scheduled',
          interviewDate,
          interviewTime,
          interviewLocation,
          adminNote,
        });
        if (!mailSent)
          throwAppError('server_error', 'Interview mailing failed');
      } else if (status === 'pending accept') {
        // If accepted date/time provided, create an orientation appointment
        try {
          if (acceptedDate) {
            const acceptedDateTime = acceptedTime
              ? new Date(`${acceptedDate}T${acceptedTime}`)
              : new Date(acceptedDate);

            await this.appointmentsService.addAppointment(
              'orientation',
              acceptedDateTime,
              id,
            );
          }
        } catch (err) {
          console.error('Failed to create orientation appointment', err);
        }

        const frontendBaseUrl =
          process.env.FRONTEND_URL?.trim() || 'https://ojt.ntc.gov.ph';
        const confirmUrl = `${frontendBaseUrl}/track?confirm=1&id=${id}&email=${encodeURIComponent(data.email)}`;

        const mailSent = await this.mailerService.acceptanceConfirmationEmail({
          to: data.email,
          firstName: data.first_name,
          lastName: data.last_name,
          applicationId: id,
          orientationDate: acceptedDate,
          orientationTime: acceptedTime,
          confirmUrl,
        });
        if (!mailSent)
          throwAppError('server_error', 'Interview mailing failed');
      } else {
        const mailSent = await this.mailerService.statusUpdateEmail({
          to: data.email,
          firstName: data.first_name,
          lastName: data.last_name,
          applicationId: id,
          status,
          adminNote,
        });
        if (!mailSent)
          throwAppError('server_error', 'Status update mailing failed');
      }

      await client.query('COMMIT');

      return SuccessHandler(
        'Application status updated successfully',
        application,
      );
    } catch (error) {
      await client.query('ROLLBACK').catch(() => undefined);
      console.error('[APPLICATIONS] Error updating status:', error);
      throwAppError('server_error', 'Failed to update application status');
    }
  }

  async confirmAcceptance(
    applicationId: number,
    email: string,
  ): Promise<SuccessResponse> {
    const client = this.databaseService.getClient();

    try {
      const exists = await client.query<Application>(
        `
              SELECT * FROM applications
              WHERE id = $1 AND LOWER(email) = LOWER($2)
              `,
        [applicationId, email],
      );

      if (exists.rowCount === 0) {
        throwAppError('not_found', 'Application not found');
      }

      const application = exists.rows[0];

      if (application.status === 'accepted') {
        return SuccessHandler('Acceptance already confirmed', application);
      }

      if (application.status !== 'pending accept') {
        throwAppError('bad_request', 'Application is not pending acceptance');
      }

      const orientationAppointment = await client.query<{
        appointment_date: Date;
      }>(
        `
          SELECT appointment_date
          FROM appointments
          WHERE application_id = $1
            AND type = 'orientation'
            AND is_cancelled = FALSE
          ORDER BY appointment_date DESC
          LIMIT 1
        `,
        [applicationId],
      );

      if (orientationAppointment.rowCount === 0) {
        throwAppError('not_found', 'Orientation schedule not found');
      }

      const appointmentDate = orientationAppointment.rows[0].appointment_date;
      const orientationDate = appointmentDate.toLocaleDateString('en-PH', {
        dateStyle: 'long',
      });
      const orientationTime = appointmentDate.toLocaleTimeString('en-PH', {
        hour: 'numeric',
        minute: '2-digit',
      });

      await client.query('BEGIN');

      const updated = await client.query<Application>(
        `
          UPDATE applications
          SET status = 'accepted', reviewed_date = CURRENT_TIMESTAMP
          WHERE id = $1
          RETURNING *
        `,
        [applicationId],
      );

      await client.query(
        `
          UPDATE ojt_data
          SET confirmed_at = CURRENT_TIMESTAMP
          WHERE email = $1
        `,
        [email],
      );

      const mailed = await this.mailerService.responseEmail({
        to: application.email,
        firstName: application.first_name,
        lastName: application.last_name,
        applicationId,
        status: 'orientation',
        acceptedDate: orientationDate,
        acceptedTime: orientationTime,
      });

      if (!mailed) {
        throwAppError('server_error', 'Orientation mailing failed');
      }

      await client.query('COMMIT');

      await this.logsService
        .logApplicationStatusChange({
          userId: 0,
          oldStatus: 'pending accept',
          newStatus: 'accepted',
        })
        .catch((err) =>
          console.error('Failed to log acceptance confirmation', err),
        );

      return SuccessHandler(
        'Acceptance confirmed successfully',
        updated.rows[0],
      );
    } catch (error) {
      await client.query('ROLLBACK').catch(() => undefined);
      console.error('[APPLICATIONS] Error confirming acceptance:', error);
      throwAppError('server_error', 'Failed to confirm acceptance');
    }
  }

  async getPendingCount(): Promise<number> {
    const client = this.databaseService.getClient();

    const res = await client.query<{ count: string }>(
      `
      SELECT COUNT(*) as count FROM applications
      WHERE status = 'pending'
      `,
    );

    return parseInt(res.rows[0]?.count || '0', 10);
  }

  async deleteApplication(id: number) {
    const client = this.databaseService.getClient();

    try {
      const exists = await client.query<Application>(
        `
              SELECT * FROM applications
              WHERE id = $1
              `,
        [id],
      );

      if (exists.rowCount === 0) {
        throwAppError('not_found', 'Application not found');
      }

      const data = exists.rows[0];

      const deletionDto = {
        to: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
        applicationId: data.id,
        applicationType: data.application_type,
      };

      const deletionMail = await this.mailerService.deletionEmail(deletionDto);
      if (!deletionMail)
        throwAppError('server_error', 'Deletion mailing failed');
      const res = await client.query(
        `
        DELETE FROM applications
        WHERE id = $1
        RETURNING *
        `,
        [id],
      );

      if (res.rowCount === 0) {
        throw new Error('Application not found');
      }

      await client.query('COMMIT');

      return SuccessHandler('Application deleted successfully', res.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK').catch(() => undefined);
      console.error('[APPLICATIONS] Error deleting application:', error);
      throwAppError('server_error', 'Failed to delete application');
    }
  }
}
