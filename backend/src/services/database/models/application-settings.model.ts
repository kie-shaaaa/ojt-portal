import { Pool } from 'pg';
import * as argon2 from 'argon2';

export async function createApplicationSettings(client: Pool) {
  await client.query(`
        CREATE TABLE IF NOT EXISTS application_settings (
            id SERIAL PRIMARY KEY,
            portal_status BOOLEAN DEFAULT FALSE,
            opening_date TIMESTAMPTZ,
            closing_date TIMESTAMP,
            office_hours_open_time VARCHAR(5) DEFAULT '07:00',
            office_hours_close_time VARCHAR(5) DEFAULT '19:00',
            office_hours_closed_days VARCHAR(50) DEFAULT 'Fri,Sat,Sun',
            created_by INTEGER REFERENCES user_accounts(id) ON DELETE SET NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);

  await client.query(`
    ALTER TABLE application_settings
    ADD COLUMN IF NOT EXISTS office_hours_open_time VARCHAR(5) DEFAULT '07:00',
    ADD COLUMN IF NOT EXISTS office_hours_close_time VARCHAR(5) DEFAULT '19:00',
    ADD COLUMN IF NOT EXISTS office_hours_closed_days VARCHAR(50) DEFAULT 'Fri,Sat,Sun';
  `);

  await client.query(
    `DROP INDEX IF EXISTS idx_application_settings_singleton;`,
  );

  await client.query(`
        CREATE INDEX IF NOT EXISTS idx_application_settings_latest
        ON application_settings (created_at DESC, id DESC);
    `);

  await client.query(`
        INSERT INTO application_settings (portal_status)
        SELECT FALSE
        WHERE NOT EXISTS (SELECT 1 FROM application_settings);
    `);

  // Hash passwords using Argon2
  const adminHash = await argon2.hash('admin123');
  const adminhrHash = await argon2.hash('adminhr');
  const employeeHash = await argon2.hash('employee123');

  await client.query(
    `
        INSERT INTO user_accounts (account_type, username, password, email, account_status) 
        VALUES 
            ('admin', 'admin', $1, 'admin@ntc.gov.ph', 'active'),
            ('admin', 'adminhr', $2, 'adminhr@gmail.com', 'active'),
            ('employee', 'hr_employee', $3, 'hr.employee@ntc.gov.ph', 'active')
        ON CONFLICT (username) DO NOTHING;
    `,
    [adminHash, adminhrHash, employeeHash],
  );
}
