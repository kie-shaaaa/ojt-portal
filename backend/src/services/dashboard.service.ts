import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { LogsService } from './logs.service';
import type {
  ApplicationSettings,
  DashboardData,
  DashboardSeriesPoint,
} from '../data/types';
import { SuccessHandler, throwAppError } from '../utils/handlers';

type DashboardSummaryRow = {
  totalApplications: number;
  pendingApplications: number;
  underReviewApplications: number;
  forInterviewApplications: number;
  rejectedApplications: number;
  acceptedApplications: number;
};

@Injectable()
export class DashboardService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly logsService: LogsService,
  ) {}

  //** Applications Setting
  // * */

  async getDashboardData(): Promise<DashboardData> {
    const client = this.databaseService.getClient();

    try {
      const [summaryResult, dailyResult, monthlyResult, statusResult] =
        await Promise.all([
          client.query<DashboardSummaryRow>(`
            SELECT
              COUNT(*)::int AS "totalApplications",
              COUNT(*) FILTER (WHERE status::text ILIKE '%pending%')::int AS "pendingApplications",
              COUNT(*) FILTER (WHERE status::text ILIKE '%under%')::int AS "underReviewApplications",
              COUNT(*) FILTER (WHERE status::text ILIKE '%interview%')::int AS "forInterviewApplications",
              COUNT(*) FILTER (WHERE status::text ILIKE '%reject%')::int AS "rejectedApplications",
              COUNT(*) FILTER (WHERE status::text ILIKE '%accept%')::int AS "acceptedApplications"
            FROM applications
          `),
          client.query<DashboardSeriesPoint>(`
            WITH days AS (
              SELECT generate_series(
                current_date - interval '29 days',
                current_date,
                interval '1 day'
              )::date AS day
            )
            SELECT
              to_char(days.day, 'Mon DD') AS label,
              COUNT(applications.id)::int AS value
            FROM days
            LEFT JOIN applications
              ON applications.submission_date::date = days.day
            GROUP BY days.day
            ORDER BY days.day
          `),
          client.query<DashboardSeriesPoint>(`
            WITH months AS (
              SELECT generate_series(
                date_trunc('month', current_date) - interval '5 months',
                date_trunc('month', current_date),
                interval '1 month'
              )::date AS month_start
            )
            SELECT
              to_char(months.month_start, 'Mon YYYY') AS label,
              COUNT(applications.id)::int AS value
            FROM months
            LEFT JOIN applications
              ON date_trunc('month', applications.submission_date)::date = months.month_start
            GROUP BY months.month_start
            ORDER BY months.month_start
          `),
          client.query<DashboardSeriesPoint>(`
            SELECT
              CASE status::text
                WHEN 'pending' THEN 'Pending'
                WHEN 'under_review' THEN 'Under Review'
                WHEN 'for_interview' THEN 'For Interview'
                WHEN 'accepted' THEN 'Accepted'
                WHEN 'rejected' THEN 'Rejected'
                WHEN 'pending accept' THEN 'Pending Accept'
                ELSE initcap(replace(status::text, '_', ' '))
              END AS label,
              COUNT(*)::int AS value
            FROM applications
            GROUP BY status::text
            ORDER BY CASE status::text
              WHEN 'pending' THEN 1
              WHEN 'under_review' THEN 2
              WHEN 'for_interview' THEN 3
              WHEN 'accepted' THEN 4
              WHEN 'rejected' THEN 5
              WHEN 'pending accept' THEN 6
              ELSE 7
            END
          `),
        ]);

      const summary = summaryResult.rows[0] ?? {
        totalApplications: 0,
        pendingApplications: 0,
        underReviewApplications: 0,
        forInterviewApplications: 0,
        rejectedApplications: 0,
        acceptedApplications: 0,
      };

      return {
        ...summary,
        dailyApplications: dailyResult.rows,
        monthlyApplications: monthlyResult.rows,
        statusDistribution: statusResult.rows,
      };
    } catch (error) {
      console.error('[DASHBOARD] Error fetching dashboard data:', error);
      throwAppError('server_error', 'Failed to fetch dashboard data');
    }
  }

  async updateApplicationSettings(settings: ApplicationSettings) {
    const client = this.databaseService.getClient();
    try {
      const update = await client.query(
        `UPDATE application_settings
             SET portal_status = $1, opening_date = $2
             WHERE id = 1
             RETURNING *`,
        [settings.state, settings.openingDate],
      );

      if (update.rowCount === 0) {
        throwAppError('not_found', 'Application settings not found');
      }

      // Log settings update (system operation)
      await this.logsService
        .logSettingsUpdated({
          userId: 0,
          key: 'application_settings',
          oldValue: 'previous',
          newValue: settings.state,
        })
        .catch((err) => console.error('Failed to log settings update', err));

      return SuccessHandler('Settings updated successfully', update.rows[0]);
    } catch (error) {
      console.error('[DASHBOARD] Error updating application settings:', error);
      throwAppError('server_error', 'Failed to update application settings');
    }
  }
}
