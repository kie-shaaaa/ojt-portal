import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DatabaseService } from './database/database.service';
import { LogsService } from './logs.service';
import { MailerService } from './mailer.service';
import SupabaseStorage from './supabase-storage.service';

@Injectable()
export class CronjobService {
  private readonly logger = new Logger(CronjobService.name);

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly logsService: LogsService,
    private readonly mailerService: MailerService,
    private readonly supabaseStorage: SupabaseStorage
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleDailyJobs(): Promise<void> {
    await this.closePortalIfClosingDateIsToday();
    await this.expirePastDueInterviewAppointments();
    await this.deleteOldOjtFiles();
  }

  private async closePortalIfClosingDateIsToday(): Promise<void> {
    const client = this.databaseService.getClient();

    try {
      const latestSettingsResult = await client.query<{
        id: number;
        portal_status: boolean;
        closing_date: Date | string | null;
        created_by: number | null;
      }>(
        `
					SELECT id, portal_status, closing_date, created_by
					FROM application_settings
					ORDER BY created_at DESC, id DESC
					LIMIT 1
				`,
      );

      const latestSettings = latestSettingsResult.rows[0];

      if (!latestSettings?.closing_date) {
        return;
      }

      const closingDate = new Date(latestSettings.closing_date);
      const today = new Date();

      if (
        closingDate.getFullYear() !== today.getFullYear() ||
        closingDate.getMonth() !== today.getMonth() ||
        closingDate.getDate() !== today.getDate()
      ) {
        return;
      }

      if (latestSettings.portal_status === false) {
        return;
      }

      const existingClosedResult = await client.query(
        `
					SELECT 1
					FROM application_settings
					WHERE portal_status = FALSE
						AND closing_date::date = CURRENT_DATE
					ORDER BY created_at DESC, id DESC
					LIMIT 1
				`,
      );

      if (existingClosedResult.rows.length > 0) {
        return;
      }

      await client.query(
        `
					INSERT INTO application_settings (portal_status, closing_date, created_by)
					VALUES (FALSE, $1, $2)
				`,
        [latestSettings.closing_date, latestSettings.created_by],
      );

      this.logger.log('Portal automatically closed based on closing_date');
    } catch (error) {
      this.logger.error(
        `Failed to auto-close portal: ${(error as Error).message}`,
      );
    }
  }

  private async expirePastDueInterviewAppointments(): Promise<void> {
    const client = this.databaseService.getClient();

    try {
      const result = await client.query<{
        appointment_id: number;
        application_id: number;
        appointment_date: Date | string;
        first_name: string;
        last_name: string;
        email: string;
        status: string;
        admin_notes: string | null;
      }>(
        `
					SELECT
					  a.id AS appointment_id,
					  a.application_id,
					  a.appointment_date,
					  ap.first_name,
					  ap.last_name,
					  ap.email,
					  ap.status,
					  ap.admin_notes
					FROM appointments a
					INNER JOIN applications ap ON ap.id = a.application_id
					WHERE a.type = 'interview'
					  AND a.appointment_date < NOW()
					  AND COALESCE(a.is_done, FALSE) = FALSE
					  AND COALESCE(a.is_cancelled, FALSE) = FALSE
					  AND ap.status = 'for_interview'
					ORDER BY a.appointment_date ASC, a.id ASC
				`,
      );

      if (!result.rowCount || result.rowCount === 0) {
        return;
      }

      let expiredCount = 0;

      for (const appointment of result.rows) {
        try {
          await client.query('BEGIN');

          const cancelResult = await client.query(
            `
						UPDATE appointments
						SET is_cancelled = TRUE,
						    is_done = FALSE
						WHERE id = $1
						  AND COALESCE(is_cancelled, FALSE) = FALSE
						RETURNING id
					`,
            [appointment.appointment_id],
          );

          if (cancelResult.rowCount === 0) {
            await client.query('ROLLBACK');
            continue;
          }

          const expiredNote = `Interview appointment expired on ${new Date(
            appointment.appointment_date,
          ).toLocaleString('en-PH', {
            dateStyle: 'long',
            timeStyle: 'short',
          })}. The application has been moved back to under review.`;

          const updatedNotes = appointment.admin_notes
            ? `${appointment.admin_notes}\n\n${expiredNote}`
            : expiredNote;

          await client.query(
            `
						UPDATE applications
						SET status = 'under_review',
						    admin_notes = $2
						WHERE id = $1
					`,
            [appointment.application_id, updatedNotes],
          );

          await this.mailerService.appointmentExpiredEmail({
            to: appointment.email,
            firstName: appointment.first_name,
            lastName: appointment.last_name,
            applicationId: appointment.application_id,
            appointmentDate: appointment.appointment_date,
            adminNote: expiredNote,
          });

          await client.query('COMMIT');

          await this.logsService
            .logApplicationStatusChange({
              applicationId: appointment.application_id,
              oldStatus: appointment.status,
              newStatus: 'under_review',
            })
            .catch((err) =>
              this.logger.warn(
                `Failed to log expired appointment status change: ${(err as Error).message}`,
              ),
            );

          await this.logsService
            .logAdminNotesAdded({
              notes: expiredNote,
            })
            .catch((err) =>
              this.logger.warn(
                `Failed to log expired appointment admin note: ${(err as Error).message}`,
              ),
            );

          expiredCount += 1;
        } catch (error) {
          await client.query('ROLLBACK').catch(() => undefined);
          this.logger.error(
            `Failed to expire appointment ${appointment.appointment_id}: ${(error as Error).message}`,
          );
        }
      }

      if (expiredCount > 0) {
        this.logger.log(
          `Expired ${expiredCount} interview appointment(s) and moved the applications back to under review`,
        );
      }
    } catch (error) {
      this.logger.error(
        `Failed to auto-expire past due interview appointments: ${(error as Error).message}`,
      );
    }
  }

  private async deleteOldOjtFiles(): Promise<void> {
    const client = this.databaseService.getClient();

    try {
      const retentionDays = 20;

      const result = await client.query<{
        file_upload_id: number;
        document_key: string | null;
        uploaded_at: Date;
        application_id: number;
      }>(
        `
      SELECT
        fu.id AS file_upload_id,
        fu.document_key,
        fu.uploaded_at,
        fu.application_id
      FROM file_uploads fu
      INNER JOIN applications a
        ON a.id = fu.application_id
      INNER JOIN ojt_data o
        ON LOWER(TRIM(o.email)) = LOWER(TRIM(a.email))
      WHERE fu.uploaded_at < NOW() - ($1 * INTERVAL '1 day')
      ORDER BY fu.uploaded_at ASC
      `,
        [retentionDays],
      );

      if (!result.rowCount) {
        return;
      }

      let deletedCount = 0;

      for (const file of result.rows) {
        try {
          await client.query('BEGIN');

          if (file.document_key) {
            await this.supabaseStorage.remove(
              process.env.SUPABASE_BUCKET!,
              file.document_key,
            );
          }

          await client.query(
            `
          DELETE FROM file_uploads
          WHERE id = $1
          `,
            [file.file_upload_id],
          );

          await client.query('COMMIT');

          deletedCount++;
        } catch (error) {
          await client.query('ROLLBACK').catch(() => undefined);

          this.logger.error(
            `Failed deleting file ${file.file_upload_id}: ${
              (error as Error).message
            }`,
          );
        }
      }

      this.logger.log(
        `Deleted ${deletedCount} old OJT file(s) from Supabase Storage`,
      );
    } catch (error) {
      this.logger.error(
        `Failed cleaning old OJT files: ${(error as Error).message}`,
      );
    }
  }
}
