import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DatabaseService } from './database/database.service';

@Injectable()
export class CronjobService {
  private readonly logger = new Logger(CronjobService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleDailyJobs(): Promise<void> {
    await this.closePortalIfClosingDateIsToday();
    await this.cancelPastDueAppointments();
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

  private async cancelPastDueAppointments(): Promise<void> {
    const client = this.databaseService.getClient();

    try {
      const result = await client.query(
        `
					UPDATE appointments
					SET is_cancelled = TRUE
					WHERE appointment_date < NOW()
						AND COALESCE(is_done, FALSE) = FALSE
						AND COALESCE(is_cancelled, FALSE) = FALSE
					RETURNING id
				`,
      );

      if (result.rowCount && result.rowCount > 0) {
        this.logger.log(
          `Auto-cancelled ${result.rowCount} appointment(s) past their appointment_date`,
        );
      }
    } catch (error) {
      this.logger.error(
        `Failed to auto-cancel past due appointments: ${(error as Error).message}`,
      );
    }
  }
}
