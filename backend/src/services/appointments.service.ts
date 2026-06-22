/* eslint-disable @typescript-eslint/no-unsafe-return */
import { HttpException, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { DatabaseService } from './database/database.service';
import { AppointmentType } from '../data/types';
import { LogsService } from './logs.service';
import { MailerService } from './mailer.service';
import { SuccessHandler, throwAppError } from '../utils/handlers';

interface AppointmentCancellationRow {
  application_id: number | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  status: string | null;
  admin_notes: string | null;
}

interface AppointmentCompletionRow {
  type: AppointmentType;
  application_id: number | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  appointment_date: Date;
  school_name: string | null;
  hours_needed: number | null;
  course: string | null;
  deployment_date: string | null;
  application_type: string | null;
}

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly logsService: LogsService,
    private readonly mailerService: MailerService,
  ) {}

  private getBackendBaseUrl(): string {
    const backendUrl = process.env.BACKEND_URL?.trim();
    if (!backendUrl) {
      console.warn(
        'BACKEND_URL is not configured. Reschedule review links will use http://localhost:5000. Set BACKEND_URL in production to the backend server URL.',
      );
    }

    return backendUrl || 'http://localhost:5000';
  }

  private async updateAppointmentStatus(
    id: number,
    updates: { isCancelled?: boolean; isDone?: boolean },
    notFoundMessage: string,
  ) {
    const client = this.databaseService.getClient();

    const result = await client.query(
      `
        UPDATE appointments
        SET
          is_cancelled = COALESCE($2, is_cancelled),
          is_done = COALESCE($3, is_done)
        WHERE id = $1
        RETURNING *
      `,
      [id, updates.isCancelled ?? null, updates.isDone ?? null],
    );

    if (result.rowCount === 0) {
      throwAppError('not_found', notFoundMessage);
    }

    return result.rows[0];
  }

  async addAppointment(
    type: AppointmentType,
    appointmentDate: Date,
    applicationId: number,
  ) {
    const client = this.databaseService.getClient();

    try {
      const existingAppointment = await client.query(
        `
          SELECT * FROM appointments
          WHERE type = $1 AND
          application_id = $2
        `,
        [type, applicationId],
      );

      if ((existingAppointment.rowCount ?? 0) > 0) {
        const result = await client.query(
          `
            UPDATE appointments
            SET
              appointment_date = $1,
              is_cancelled = FALSE,
              is_done = FALSE
            WHERE type = $2 AND
              application_id = $3
            RETURNING *
          `,
          [appointmentDate, type, applicationId],
        );

        if (result.rows.length === 0) {
          throwAppError('server_error', 'Failed to update appointment');
        }

        await this.logsService
          .logOther({
            userId: 0,
            action: 'Appointment Updated',
            details: `Appointment updated for application ${applicationId} to ${appointmentDate.toISOString()}`,
          })
          .catch((err) =>
            console.error('Failed to log appointment update', err),
          );

        return SuccessHandler(
          'Appointment updated successfully',
          result.rows[0],
        );
      }

      const result = await client.query(
        `
      INSERT INTO appointments (type, appointment_date, application_id)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
        [type, appointmentDate, applicationId],
      );

      if (result.rows.length === 0) {
        throwAppError('server_error', 'Failed to create appointment');
      }

      // Log appointment creation (system operation)
      await this.logsService
        .logOther({
          userId: 0,
          action: 'Appointment Created',
          details: `Appointment created for application ${applicationId} on ${appointmentDate.toISOString()}`,
        })
        .catch((err) =>
          console.error('Failed to log appointment creation', err),
        );

      return SuccessHandler('Appointment created successfully', result.rows[0]);
    } catch (error) {
      console.error('[APPOINTMENT] Error:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throwAppError('server_error', 'Failed to create appointment');
    }
  }

  async cancelAppointment(id: number, cancellationReason?: string) {
    const client = this.databaseService.getClient();

    try {
      const appointmentResult = await client.query(
        `
          SELECT
            a.id,
            a.application_id,
            a.type,
            a.appointment_date,
            a.is_cancelled,
            a.is_done,
            ap.first_name,
            ap.last_name,
            ap.email,
            ap.status,
            ap.admin_notes
          FROM appointments a
          LEFT JOIN applications ap ON ap.id = a.application_id
          WHERE a.id = $1
        `,
        [id],
      );

      if (appointmentResult.rowCount === 0) {
        throwAppError('not_found', 'Appointment not found');
      }

      const appointment = appointmentResult
        .rows[0] as AppointmentCancellationRow;

      await client.query('BEGIN');

      await client.query(
        `
          UPDATE appointments
          SET is_cancelled = TRUE,
              is_done = FALSE
          WHERE id = $1
        `,
        [id],
      );

      const trimmedReason = cancellationReason?.trim();

      if (appointment.application_id) {
        if (trimmedReason) {
          const updatedNotes = appointment.admin_notes
            ? `${appointment.admin_notes}\n\n${trimmedReason}`
            : trimmedReason;

          await client.query(
            `
              UPDATE applications
              SET status = 'under_review',
                  admin_notes = $2
              WHERE id = $1
            `,
            [appointment.application_id, updatedNotes],
          );
        } else {
          await client.query(
            `
              UPDATE applications
              SET status = 'under_review'
              WHERE id = $1
            `,
            [appointment.application_id],
          );
        }
      }

      // Log appointment cancellation
      if (appointment.application_id) {
        await this.logsService
          .logApplicationStatusChange({
            oldStatus: appointment.status ?? undefined,
            newStatus: 'under_review',
          })
          .catch((err) =>
            console.error('Failed to log application status change', err),
          );

        if (trimmedReason) {
          await this.logsService
            .logAdminNotesAdded({
              notes: trimmedReason,
            })
            .catch((err) => console.error('Failed to log admin notes', err));
        }

        if (appointment.email) {
          const mailSent = await this.mailerService.statusUpdateEmail({
            to: appointment.email,
            firstName: appointment.first_name ?? '',
            lastName: appointment.last_name ?? '',
            applicationId: appointment.application_id,
            status: 'under_review',
            adminNote: trimmedReason || undefined,
          });

          if (!mailSent) {
            throwAppError('server_error', 'Status update mailing failed');
          }
        }
      }

      await client.query('COMMIT');

      await this.logsService
        .logOther({
          action: 'Appointment Cancelled',
          details: trimmedReason
            ? `Appointment ${id} cancelled. Message: ${trimmedReason}`
            : `Appointment ${id} cancelled`,
        })
        .catch((err) =>
          console.error('Failed to log appointment cancellation', err),
        );

      return SuccessHandler('Appointment cancelled successfully', appointment);
    } catch (error) {
      await client.query('ROLLBACK').catch(() => undefined);
      console.error('[APPOINTMENT] Error cancelling appointment:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throwAppError('server_error', 'Failed to cancel appointment');
    }
  }

  private async findAppointmentRecord(
    client: Pool,
    applicationId: number,
    appointmentType: AppointmentType,
  ) {
    const appointmentInfo = await client.query<{
      type: AppointmentType;
      first_name: string | null;
      last_name: string | null;
      email: string | null;
      reschedule_count: number | null;
      pending_reschedule_status: 'pending' | 'approved' | 'rejected' | null;
      pending_reschedule_date: Date | null;
      appointment_date: Date;
    }>(
      `
          SELECT a.type,
                 ap.first_name,
                 ap.last_name,
                 ap.email,
                 COALESCE(a.reschedule_count, 0) AS reschedule_count,
                 a.pending_reschedule_status,
                 a.pending_reschedule_date,
                 a.appointment_date
          FROM appointments a
          LEFT JOIN applications ap ON ap.id = a.application_id
          WHERE a.application_id = $1
            AND a.type = $2
            AND COALESCE(a.is_cancelled, FALSE) = FALSE
          ORDER BY a.appointment_date DESC
          LIMIT 1
        `,
      [applicationId, appointmentType],
    );

    return appointmentInfo.rows[0] ?? null;
  }

  async updateAppointment(
    applicationId: number,
    appointmentDate: Date,
    appointmentType: AppointmentType,
  ) {
    const client = this.databaseService.getClient();

    try {
      const appointmentRecord = await this.findAppointmentRecord(
        client,
        applicationId,
        appointmentType,
      );

      if (!appointmentRecord) {
        throwAppError('not_found', 'No appointment found for this application');
      }

      if (appointmentRecord.pending_reschedule_status === 'pending') {
        throwAppError(
          'bad_request',
          'A reschedule request is already pending approval. Please wait for admin review before submitting another request.',
        );
      }

      if ((appointmentRecord.reschedule_count ?? 0) >= 3) {
        throwAppError(
          'bad_request',
          'You have reached the maximum of three reschedules for this appointment.',
        );
      }

      await client.query('BEGIN');

      const result = await client.query(
        `
          UPDATE appointments
          SET pending_reschedule_date = $1,
              pending_reschedule_status = 'pending',
              pending_reschedule_requested_at = CURRENT_TIMESTAMP
          WHERE application_id = $2
            AND type = $3
            AND COALESCE(is_cancelled, FALSE) = FALSE
          RETURNING *
        `,
        [appointmentDate, applicationId, appointmentType],
      );

      if (result.rowCount === 0) {
        await client.query('ROLLBACK');
        throwAppError('not_found', 'No appointment found for this application');
      }

      const backendBaseUrl = this.getBackendBaseUrl();
      const approveUrl = `${backendBaseUrl}/appointments/review-reschedule?decision=approve&applicationId=${applicationId}&type=${appointmentType}`;
      const rejectUrl = `${backendBaseUrl}/appointments/review-reschedule?decision=reject&applicationId=${applicationId}&type=${appointmentType}`;

      await client.query('COMMIT');

      // Log reschedule request
      await this.logsService
        .logOther({
          action: 'Appointment Reschedule Requested',
          details: `Appointment reschedule requested for application ${applicationId} to ${appointmentDate.toISOString()}`,
        })
        .catch((err) => console.error('Failed to log reschedule request', err));

      if (appointmentRecord.email) {
        const requestedDate = appointmentDate.toLocaleDateString('en-PH', {
          dateStyle: 'long',
        });
        const requestedTime = appointmentDate.toLocaleTimeString('en-PH', {
          hour: 'numeric',
          minute: '2-digit',
        });

        await this.mailerService
          .appointmentRescheduleReviewEmail({
            applicantEmail: appointmentRecord.email,
            firstName: appointmentRecord.first_name ?? '',
            lastName: appointmentRecord.last_name ?? '',
            applicationId,
            appointmentType,
            requestedDate,
            requestedTime,
            approveUrl,
            rejectUrl,
          })
          .catch((err) =>
            console.error(
              'Failed to send reschedule review email to admin',
              err,
            ),
          );
      }

      return SuccessHandler(
        'Your reschedule request has been submitted for admin approval.',
        result.rows[0],
      );
    } catch (error) {
      await client.query('ROLLBACK').catch(() => undefined);
      console.error('[APPOINTMENT] Error updating appointment:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throwAppError('server_error', 'Failed to submit reschedule request');
    }
  }

  async approveReschedule(
    applicationId: number,
    appointmentType: AppointmentType,
  ) {
    const client = this.databaseService.getClient();

    try {
      const appointmentRecord = await this.findAppointmentRecord(
        client,
        applicationId,
        appointmentType,
      );

      if (!appointmentRecord) {
        throwAppError('not_found', 'No appointment found for this application');
      }

      if (appointmentRecord.pending_reschedule_status !== 'pending') {
        throwAppError(
          'bad_request',
          'No pending reschedule request found for this appointment.',
        );
      }

      if (!appointmentRecord.pending_reschedule_date) {
        throwAppError(
          'bad_request',
          'No requested reschedule date is available.',
        );
      }

      console.log('[APPOINTMENT] Approving reschedule:', {
        applicationId,
        appointmentType,
        pendingDate: appointmentRecord.pending_reschedule_date,
        currentDate: appointmentRecord.appointment_date,
      });

      await client.query('BEGIN');

      const result = await client.query(
        `
          UPDATE appointments
          SET appointment_date = pending_reschedule_date,
              pending_reschedule_date = NULL,
              pending_reschedule_status = 'approved',
              pending_reschedule_requested_at = NULL,
              reschedule_count = COALESCE(reschedule_count, 0) + 1
          WHERE application_id = $1
            AND type = $2
            AND COALESCE(is_cancelled, FALSE) = FALSE
          RETURNING *
        `,
        [applicationId, appointmentType],
      );

      if (result.rowCount === 0) {
        await client.query('ROLLBACK');
        throwAppError('not_found', 'Failed to approve reschedule request');
      }

      const updatedAppointment = result.rows[0];

      console.log('[APPOINTMENT] Updated appointment:', updatedAppointment);

      // Update application status based on appointment type
      // For interview appointments, set to 'for_interview'
      // For orientation appointments, keep as 'accepted'
      if (appointmentType === 'interview') {
        await client.query(
          `
            UPDATE applications
            SET status = 'for_interview'
            WHERE id = $1
          `,
          [applicationId],
        );
      }
      // For orientation, do not change status - keep it as 'accepted'

      await client.query('COMMIT');

      await this.logsService
        .logOther({
          action: 'Appointment Reschedule Approved',
          details: `Reschedule approved for application ${applicationId}`,
        })
        .catch((err) => console.error('Failed to log reschedule approval', err));

      if (appointmentRecord.email) {
        const originalDate = appointmentRecord.appointment_date.toLocaleDateString(
          'en-PH',
          { dateStyle: 'long' },
        );
        const originalTime = appointmentRecord.appointment_date.toLocaleTimeString(
          'en-PH',
          { hour: 'numeric', minute: '2-digit' },
        );
        const requestedDate = updatedAppointment.appointment_date.toLocaleDateString(
          'en-PH',
          { dateStyle: 'long' },
        );
        const requestedTime = updatedAppointment.appointment_date.toLocaleTimeString(
          'en-PH',
          { hour: 'numeric', minute: '2-digit' },
        );

        const canRescheduleAgain = (updatedAppointment.reschedule_count ?? 0) < 3;
        const frontendBaseUrl =
          process.env.FRONTEND_URL?.trim() || 'https://ojt.ntc.gov.ph';
        const rescheduleUrl = canRescheduleAgain
          ? `${frontendBaseUrl}/track?action=reschedule&kind=${appointmentType}&id=${applicationId}&email=${encodeURIComponent(appointmentRecord.email)}`
          : undefined;

        await this.mailerService
          .appointmentRescheduleDecisionEmail({
            to: appointmentRecord.email,
            firstName: appointmentRecord.first_name ?? '',
            lastName: appointmentRecord.last_name ?? '',
            applicationId,
            appointmentType,
            decision: 'approved',
            originalDate,
            originalTime,
            requestedDate,
            requestedTime,
            canRescheduleAgain,
            rescheduleUrl,
          })
          .catch((err) =>
            console.error('Failed to send reschedule approval email', err),
          );
      }

      return SuccessHandler('Reschedule request approved successfully', updatedAppointment);
    } catch (error) {
      await client.query('ROLLBACK').catch(() => undefined);
      console.error('[APPOINTMENT] Error approving reschedule request:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throwAppError('server_error', 'Failed to approve reschedule request');
    }
  }

  async rejectReschedule(
    applicationId: number,
    appointmentType: AppointmentType,
  ) {
    const client = this.databaseService.getClient();

    try {
      const appointmentRecord = await this.findAppointmentRecord(
        client,
        applicationId,
        appointmentType,
      );

      if (!appointmentRecord) {
        throwAppError('not_found', 'No appointment found for this application');
      }

      if (appointmentRecord.pending_reschedule_status !== 'pending') {
        throwAppError(
          'bad_request',
          'No pending reschedule request found for this appointment.',
        );
      }

      if (!appointmentRecord.pending_reschedule_date) {
        throwAppError(
          'bad_request',
          'No requested reschedule date is available.',
        );
      }

      await client.query(
        `
          UPDATE appointments
          SET pending_reschedule_date = NULL,
              pending_reschedule_status = 'rejected',
              pending_reschedule_requested_at = NULL
          WHERE application_id = $1
            AND type = $2
            AND COALESCE(is_cancelled, FALSE) = FALSE
        `,
        [applicationId, appointmentType],
      );

      await this.logsService
        .logOther({
          action: 'Appointment Reschedule Rejected',
          details: `Reschedule rejected for application ${applicationId}`,
        })
        .catch((err) => console.error('Failed to log reschedule rejection', err));

      if (appointmentRecord.email) {
        const originalDate = appointmentRecord.appointment_date.toLocaleDateString(
          'en-PH',
          { dateStyle: 'long' },
        );
        const originalTime = appointmentRecord.appointment_date.toLocaleTimeString(
          'en-PH',
          { hour: 'numeric', minute: '2-digit' },
        );
        const requestedDate = appointmentRecord.pending_reschedule_date.toLocaleDateString(
          'en-PH',
          { dateStyle: 'long' },
        );
        const requestedTime = appointmentRecord.pending_reschedule_date.toLocaleTimeString(
          'en-PH',
          { hour: 'numeric', minute: '2-digit' },
        );

        const canRescheduleAgain = (appointmentRecord.reschedule_count ?? 0) < 3;
        const frontendBaseUrl =
          process.env.FRONTEND_URL?.trim() || 'https://ojt.ntc.gov.ph';
        const rescheduleUrl = canRescheduleAgain
          ? `${frontendBaseUrl}/track?action=reschedule&kind=${appointmentType}&id=${applicationId}&email=${encodeURIComponent(appointmentRecord.email)}`
          : undefined;

        await this.mailerService
          .appointmentRescheduleDecisionEmail({
            to: appointmentRecord.email,
            firstName: appointmentRecord.first_name ?? '',
            lastName: appointmentRecord.last_name ?? '',
            applicationId,
            appointmentType,
            decision: 'rejected',
            originalDate,
            originalTime,
            requestedDate,
            requestedTime,
            canRescheduleAgain,
            rescheduleUrl,
          })
          .catch((err) =>
            console.error('Failed to send reschedule rejection email', err),
          );
      }

      return SuccessHandler('Reschedule request rejected successfully');
    } catch (error) {
      console.error('[APPOINTMENT] Error rejecting reschedule request:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throwAppError('server_error', 'Failed to reject reschedule request');
    }
  }

  async completedAppointment(id: number) {
    const client = this.databaseService.getClient();
    let isOrientationAppointment = false;

    try {
      // First, get the appointment details including type and application info
      const appointmentResult = await client.query(
        `
        SELECT a.id, a.type, a.application_id, ap.first_name, ap.last_name, ap.email,
               ap.school_name, ap.hours_needed, ap.course, ap.deployment_date, ap.application_type
        FROM appointments a
        LEFT JOIN applications ap ON ap.id = a.application_id
        WHERE a.id = $1
        `,
        [id],
      );

      if (appointmentResult.rowCount === 0) {
        throwAppError('not_found', 'Appointment not found');
      }

      const appointment = appointmentResult.rows[0] as AppointmentCompletionRow;
      isOrientationAppointment = appointment.type === 'orientation';

      // Begin transaction for orientation appointments
      if (isOrientationAppointment) {
        await client.query('BEGIN');
      }

      // Mark appointment as done
      await this.updateAppointmentStatus(
        id,
        { isDone: true, isCancelled: false },
        'Appointment not found',
      );

      // If it's an orientation appointment, also add to ojt_data
      if (isOrientationAppointment && appointment.application_id) {
        const ojtResult = await client.query(
          `
          UPDATE ojt_data
          SET confirmed_at = CURRENT_TIMESTAMP
          WHERE email = $1
          RETURNING id
          `,
          [appointment.email],
        );

        if (ojtResult.rowCount === 0) {
          await client.query(
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
              moved_to_ojt_at,
              confirmed_at
            )
            VALUES ($1, $2, $3, $4, '', $5, $6, $7, $8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            `,
            [
              appointment.application_type,
              appointment.first_name,
              appointment.last_name,
              appointment.email,
              appointment.school_name,
              appointment.hours_needed,
              appointment.course,
              appointment.deployment_date,
            ],
          );
        }

        // Also update the application status to 'accepted' if not already
        if (appointment.application_id) {
          await client.query(
            `
            UPDATE applications
            SET status = 'accepted'
            WHERE id = $1 AND status != 'accepted'
            `,
            [appointment.application_id],
          );
        }

        await client.query('COMMIT');
      }

      // Log appointment completion
      await this.logsService
        .logOther({
          action: 'Appointment Completed',
          details: `Appointment ${id} marked as completed`,
        })
        .catch((err) =>
          console.error('Failed to log appointment completion', err),
        );

      return SuccessHandler('Appointment completed successfully');
    } catch (error) {
      if (isOrientationAppointment) {
        await client.query('ROLLBACK').catch(() => undefined);
      }
      console.error('[APPOINTMENT] Error completing appointment:', error);
      throwAppError('server_error', 'Failed to complete appointment');
    }
  }

  async confirmAppointment(applicationId: number, kind?: 'orientation' | 'interview') {
    const client = this.databaseService.getClient();

    try {
      const appointmentQueryParts = [
        `
          SELECT a.type, a.application_id, ap.first_name, ap.last_name, ap.email,
                 ap.school_name, ap.hours_needed, ap.course, ap.deployment_date, ap.application_type,
                 a.appointment_date
          FROM appointments a
          LEFT JOIN applications ap ON ap.id = a.application_id
          WHERE a.application_id = $1
            AND a.is_cancelled = FALSE
        `,
      ];
      const appointmentParams: Array<number | string> = [applicationId];

      if (kind) {
        appointmentQueryParts.push(`AND a.type = $2`);
        appointmentParams.push(kind);
      }

      appointmentQueryParts.push(`ORDER BY a.appointment_date DESC LIMIT 1`);

      const appointmentResult = await client.query<AppointmentCompletionRow>(
        appointmentQueryParts.join('\n'),
        appointmentParams,
      );

      if (appointmentResult.rowCount === 0) {
        throwAppError('not_found', 'Appointment not found');
      }

      const appointment = appointmentResult.rows[0];

      if (!appointment.email) {
        throwAppError('not_found', 'Applicant not found');
      }

      await this.logsService
        .logOther({
          action: 'Appointment Updated',
          details: `Appointment for application ${applicationId} confirmed by applicant`,
        })
        .catch((err) =>
          console.error('Failed to log appointment confirmation', err),
        );

      // If kind is specified, it's the schedule confirmation (not acceptance confirmation)
      if (kind === 'orientation') {
        // Send orientation schedule email with reschedule option
        const frontendBaseUrl =
          process.env.FRONTEND_URL?.trim() || 'https://ojt.ntc.gov.ph';
        const confirmUrl = `${frontendBaseUrl}/track?action=confirm&kind=orientation&id=${applicationId}&email=${encodeURIComponent(appointment.email)}`;
        const rescheduleUrl = `${frontendBaseUrl}/track?action=reschedule&kind=orientation&id=${applicationId}&email=${encodeURIComponent(appointment.email)}`;

        await this.mailerService.responseEmail({
          to: appointment.email,
          firstName: appointment.first_name ?? '',
          lastName: appointment.last_name ?? '',
          applicationId,
          status: 'orientation',
          acceptedDate: appointment.appointment_date.toLocaleDateString('en-PH', {
            dateStyle: 'long',
          }),
          acceptedTime: appointment.appointment_date.toLocaleTimeString('en-PH', {
            hour: 'numeric',
            minute: '2-digit',
          }),
          interviewLocation: undefined,
          confirmUrl,
          rescheduleUrl,
          adminNote: undefined,
        }).catch((err) =>
          console.error('Failed to send orientation schedule email', err),
        );
      } else if (kind === 'interview') {
        await client.query(
          `
            UPDATE applications
            SET status = 'for_interview'
            WHERE id = $1
              AND status = 'pending accept'
          `,
          [applicationId],
        );
      } else {
        // Default behavior: acceptance confirmation (no kind parameter)
        if (appointment.type === 'orientation') {
          // Send orientation schedule email with reschedule option
          const frontendBaseUrl =
            process.env.FRONTEND_URL?.trim() || 'https://ojt.ntc.gov.ph';
          const confirmUrl = `${frontendBaseUrl}/track?action=confirm&kind=orientation&id=${applicationId}&email=${encodeURIComponent(appointment.email)}`;
          const rescheduleUrl = `${frontendBaseUrl}/track?action=reschedule&kind=orientation&id=${applicationId}&email=${encodeURIComponent(appointment.email)}`;

          await this.mailerService.responseEmail({
            to: appointment.email,
            firstName: appointment.first_name ?? '',
            lastName: appointment.last_name ?? '',
            applicationId,
            status: 'orientation',
            acceptedDate: appointment.appointment_date.toLocaleDateString('en-PH', {
              dateStyle: 'long',
            }),
            acceptedTime: appointment.appointment_date.toLocaleTimeString('en-PH', {
              hour: 'numeric',
              minute: '2-digit',
            }),
            interviewLocation: undefined,
            confirmUrl,
            rescheduleUrl,
            adminNote: undefined,
          }).catch((err) =>
            console.error('Failed to send orientation schedule email', err),
          );
        } else if (appointment.type === 'interview') {
          await client.query(
            `
              UPDATE applications
              SET status = 'for_interview'
              WHERE id = $1
                AND status = 'pending accept'
            `,
            [applicationId],
          );

          // Send interview schedule email with reschedule option
          const frontendBaseUrl =
            process.env.FRONTEND_URL?.trim() || 'https://ojt.ntc.gov.ph';
          const confirmUrl = `${frontendBaseUrl}/track?action=confirm&kind=interview&id=${applicationId}&email=${encodeURIComponent(appointment.email)}`;
          const rescheduleUrl = `${frontendBaseUrl}/track?action=reschedule&kind=interview&id=${applicationId}&email=${encodeURIComponent(appointment.email)}`;

          await this.mailerService.responseEmail({
            to: appointment.email,
            firstName: appointment.first_name ?? '',
            lastName: appointment.last_name ?? '',
            applicationId,
            status: 'scheduled',
            interviewDate: appointment.appointment_date.toLocaleDateString('en-PH', {
              dateStyle: 'long',
            }),
            interviewTime: appointment.appointment_date.toLocaleTimeString('en-PH', {
              hour: 'numeric',
              minute: '2-digit',
            }),
            interviewLocation: 'NTC Main Office, Quezon City',
            confirmUrl,
            rescheduleUrl,
            adminNote: undefined,
          }).catch((err) =>
            console.error('Failed to send interview schedule email', err),
          );
        }
      }

      await this.mailerService
        .appointmentActionNotificationEmail({
          action: 'confirmed',
          appointmentType: kind ?? appointment.type,
          applicationId,
          firstName: appointment.first_name ?? '',
          lastName: appointment.last_name ?? '',
          email: appointment.email,
          appointmentDate: appointment.appointment_date.toLocaleDateString(
            'en-PH',
            { dateStyle: 'long' },
          ),
          appointmentTime: appointment.appointment_date.toLocaleTimeString(
            'en-PH',
            {
              hour: 'numeric',
              minute: '2-digit',
            },
          ),
        })
        .catch((err) =>
          console.error(
            'Failed to send appointment confirmation notification',
            err,
          ),
        );

      return SuccessHandler('Appointment confirmation recorded successfully', {
        applicationId,
      });
    } catch (error) {
      console.error('[APPOINTMENT] Error confirming appointment:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throwAppError('server_error', 'Failed to confirm appointment');
    }
  }

  async getAppointments(month: string, year: string) {
    const client = this.databaseService.getClient();

    try {
      const monthNumber = parseInt(month, 10);
      const yearNumber = parseInt(year, 10);

      if (
        isNaN(monthNumber) ||
        isNaN(yearNumber) ||
        monthNumber < 1 ||
        monthNumber > 12
      ) {
        throwAppError('bad_request', 'Invalid month or year');
      }

      // Start of month (e.g. 2026-05-01 00:00:00) - use UTC to avoid timezone issues
      const startDate = new Date(Date.UTC(yearNumber, monthNumber - 1, 1));

      // Start of next month (exclusive upper bound) - use UTC to avoid timezone issues
      const endDate = new Date(Date.UTC(yearNumber, monthNumber, 1));

      const query = `
      SELECT
        a.id,
        a.type,
        a.appointment_date,
        a.application_id,
        a.is_done,
        ap.status AS application_status,
        ap.first_name AS application_first_name,
        ap.last_name AS application_last_name,
        ap.email AS application_email,
        ap.school_name AS application_school_name,
        ap.course AS application_course,
        ap.hours_needed AS application_hours_needed,
        ap.deployment_date AS application_deployment_date
      FROM appointments a
      LEFT JOIN applications ap ON ap.id = a.application_id
      WHERE a.appointment_date >= $1
        AND a.appointment_date < $2
        AND a.is_done = FALSE
        AND COALESCE(a.is_cancelled, FALSE) = FALSE
        AND (a.type != 'orientation' OR ap.status = 'accepted')
      ORDER BY a.appointment_date ASC
    `;

      const values = [startDate, endDate];

      const result = await client.query(query, values);

      return SuccessHandler('Appointments fetched successfully', result.rows);
    } catch (error) {
      console.error('[APPOINTMENT] Error fetching appointments:', error);
      throwAppError('server_error', 'Failed to fetch appointments');
    }
  }
}
