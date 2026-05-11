import { Client } from 'pg';

export async function createLogs(client: Client) {
  await client.query(`
    DO $$
    BEGIN
      CREATE TYPE log_action AS ENUM (
        'user_created',
        'user_updated',
        'user_deleted',
        'user_status_changed',
        'application_reviewed',
        'application_status_changed',
        'admin_notes_added',
        'account_locked',
        'account_unlocked',
        'password_reset',
        'settings_updated',
        'file_uploaded',
        'file_deleted',
        'other'
      );
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS logs (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES user_accounts(id) ON DELETE CASCADE,
      action log_action NOT NULL,
      target_type VARCHAR(50) NOT NULL,
      target_id INTEGER,
      target_name VARCHAR(255),
      details TEXT,
      ip_address VARCHAR(45),
      user_agent VARCHAR(500),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await client
    .query(
      `
        CREATE INDEX IF NOT EXISTS idx_logs_user_id ON logs(user_id);
      `,
    )
    .catch(() => {
      // Index may already exist, ignore error
    });

  await client
    .query(
      `
        CREATE INDEX IF NOT EXISTS idx_logs_created_at ON logs(created_at DESC);
      `,
    )
    .catch(() => {
      // Index may already exist, ignore error
    });

  await client
    .query(
      `
        CREATE INDEX IF NOT EXISTS idx_logs_action ON logs(action);
      `,
    )
    .catch(() => {
      // Index may already exist, ignore error
    });

  await client
    .query(
      `
        CREATE INDEX IF NOT EXISTS idx_logs_target_type ON logs(target_type, target_id);
      `,
    )
    .catch(() => {
      // Index may already exist, ignore error
    });
}
