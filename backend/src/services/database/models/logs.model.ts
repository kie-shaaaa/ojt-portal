import { Pool } from 'pg';

export async function createLogs(client: Pool) {
  await client.query(`
    DO $$
    BEGIN
      CREATE TYPE log_action AS ENUM (
        'User Created',
        'User Updated',
        'User Deleted',
        'Logged In',
        'User Status Update',
        'Application Reviewed',
        'Application Status Change',
        'Admin Notes Added',
        'Account Locked',
        'Account Unlocked',
        'Password Reset',
        'Settings Updated',
        'File Uploaded',
        'File Deleted',
        'other'
      );
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS logs (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES user_accounts(id) ON DELETE CASCADE,
      action log_action NOT NULL,
      details TEXT,
      ip_address VARCHAR(45),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await client
    .query(
      `
    ALTER TABLE IF EXISTS logs
    ALTER COLUMN user_id DROP NOT NULL;
  `,
    )
    .catch(() => undefined);

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
}
