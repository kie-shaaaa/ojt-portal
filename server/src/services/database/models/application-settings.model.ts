import { Client } from 'pg';

export async function createApplicationSettings(client: Client) {
  await client.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);

  await client.query(`
        CREATE TABLE IF NOT EXISTS application_settings (
            id SERIAL PRIMARY KEY,
            setting_key VARCHAR(50) UNIQUE NOT NULL,
            setting_value TEXT,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_by_name VARCHAR(100)
        );
    `);

  await client
    .query(
      `
        CREATE INDEX idx_setting_key ON application_settings (setting_key);
    `,
    )
    .catch(() => {
      // Index may already exist, ignore error
    });

  await client.query(`
        INSERT INTO application_settings (setting_key, setting_value) VALUES
            ('portal_status', 'closed'),
            ('opening_date', NULL),
            ('last_updated_by', NULL)
        ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value;
    `);

  await client.query(`
        INSERT INTO user_accounts (account_type, username, password, email, account_status) 
        VALUES 
            ('admin', 'admin', crypt('admin123', gen_salt('bf')), 'admin@ntc.gov.ph', 'active'),
            ('admin', 'adminhr', crypt('adminhr', gen_salt('bf')), 'adminhr@gmail.com', 'active'),
            ('employee', 'hr_employee', crypt('employee123', gen_salt('bf')), 'hr.employee@ntc.gov.ph', 'active')
        ON CONFLICT (username) DO NOTHING;
    `);
}
