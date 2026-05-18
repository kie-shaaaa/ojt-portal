import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import {
  LogSignIn,
  LogChangePassword,
  LogAction,
  LogUserCreated,
  LogUserUpdated,
  LogUserDeleted,
  LogUserStatusUpdate,
  LogApplicationReviewed,
  LogApplicationStatusChange,
  LogAdminNotesAdded,
  LogAccountLock,
  LogAccountUnlock,
  LogPasswordReset,
  LogSettingsUpdated,
  LogFileUploaded,
  LogFileDeleted,
  LogOther,
  FetchAllLogs,
  Logs,
} from '../data/types';
import { throwAppError } from '../../utils/handlers';

@Injectable()
export class LogsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async fetchAllLogs(limit: number, page: number): Promise<FetchAllLogs> {
    const client = this.databaseService.getClient();
    try {
      if (!limit || !page) {
        throw new BadRequestException('there is no limit or page');
      }

      const query = `
        SELECT
          l.id,
          l.user_id,
          l.action,
          l.details,
          l.ip_address,
          l.created_at
        FROM logs l
        ORDER BY l.created_at DESC, l.id DESC
        LIMIT $1
        OFFSET $2
      `;

      const offset = (page - 1) * limit;

      const values = [limit, offset];

      const result = await client.query<Logs>(query, values);

      return result.rows || [];
    } catch (error) {
      console.log(`[LOGS] error fetching logs`, error);
      throwAppError('server_error', 'Error fetching logs');
    }
  }

  async logSignIn(logs: LogSignIn): Promise<void> {
    const client = this.databaseService.getClient();
    try {
      const status = logs.success ? 'SUCCESS' : 'FAILED';

      await client.query(
        `   
        INSERT INTO logs (user_id, action, details, ip_address)
        VALUES ($1, 'Logged In', $2, $3);
        `,
        [logs.userId, status, logs.ipAddress],
      );
    } catch (error) {
      console.error('Failed to log sign-in event', error);
    }
  }

  async logChangePassword(log: LogChangePassword): Promise<void> {
    const client = this.databaseService.getClient();
    try {
      await client.query(
        `
        INSERT INTO logs (user_id, action, details, ip_address)
        VALUES ($1, 'Password Reset', $2, $3);
        `,
        [log.userId, log.details, log.ipAddress],
      );
    } catch (error) {
      console.error('Failed to log password change', error);
    }
  }

  private async insertLog(
    userId: number | undefined,
    action: LogAction,
    details?: string,
    ipAddress?: string,
  ) {
    const client = this.databaseService.getClient();
    try {
      await client.query(
        `
        INSERT INTO logs (user_id, action, details, ip_address)
        VALUES ($1, $2, $3, $4);
        `,
        [userId || null, action, details || null, ipAddress || null],
      );
    } catch (error) {
      console.error(`Failed to insert log (${action})`, error);
    }
  }

  async logUserCreated(payload: LogUserCreated) {
    await this.insertLog(
      payload.userId,
      'User Created',
      payload.details,
      payload.ipAddress,
    );
  }

  async logUserUpdated(payload: LogUserUpdated) {
    await this.insertLog(
      payload.userId,
      'User Updated',
      payload.changes || payload.details,
      payload.ipAddress,
    );
  }

  async logUserDeleted(payload: LogUserDeleted) {
    await this.insertLog(
      payload.userId,
      'User Deleted',
      payload.details,
      payload.ipAddress,
    );
  }

  async logUserStatusUpdate(payload: LogUserStatusUpdate) {
    const details = `Status changed from ${payload.oldStatus || 'unknown'} to ${payload.newStatus || 'unknown'}`;
    await this.insertLog(
      payload.userId,
      'User Status Update',
      details,
      payload.ipAddress,
    );
  }

  async logApplicationReviewed(payload: LogApplicationReviewed) {
    await this.insertLog(
      payload.userId,
      'Application Reviewed',
      payload.notes || payload.details,
      payload.ipAddress,
    );
  }

  async logApplicationStatusChange(payload: LogApplicationStatusChange) {
    const details = `Status changed from ${payload.oldStatus || 'unknown'} to ${payload.newStatus || 'unknown'}`;
    await this.insertLog(
      payload.userId,
      'Application Status Change',
      details,
      payload.ipAddress,
    );
  }

  async logAdminNotesAdded(payload: LogAdminNotesAdded) {
    await this.insertLog(
      payload.userId,
      'Admin Notes Added',
      payload.notes || payload.details,
      payload.ipAddress,
    );
  }

  async logAccountLock(payload: LogAccountLock) {
    await this.insertLog(
      payload.userId,
      'Account Locked',
      payload.reason || payload.details,
      payload.ipAddress,
    );
  }

  async logAccountUnlock(payload: LogAccountUnlock) {
    await this.insertLog(
      payload.userId,
      'Account Unlocked',
      payload.details,
      payload.ipAddress,
    );
  }

  async logPasswordReset(payload: LogPasswordReset) {
    await this.insertLog(
      payload.userId,
      'Password Reset',
      payload.method || payload.details,
      payload.ipAddress,
    );
  }

  async logSettingsUpdated(payload: LogSettingsUpdated) {
    const details = `Updated ${payload.key}: ${payload.oldValue} -> ${payload.newValue}`;
    await this.insertLog(
      payload.userId,
      'Settings Updated',
      details,
      payload.ipAddress,
    );
  }

  async logFileUploaded(payload: LogFileUploaded) {
    const details = `Uploaded ${payload.filename} (${payload.size || 0} bytes)`;
    await this.insertLog(
      payload.userId,
      'File Uploaded',
      details,
      payload.ipAddress,
    );
  }

  async logFileDeleted(payload: LogFileDeleted) {
    const details = `Deleted ${payload.filename}`;
    await this.insertLog(
      payload.userId,
      'File Deleted',
      details,
      payload.ipAddress,
    );
  }

  async logOther(payload: LogOther) {
    await this.insertLog(
      payload.userId,
      (payload.action as LogAction) || 'other',
      payload.details,
      payload.ipAddress,
    );
  }
}
