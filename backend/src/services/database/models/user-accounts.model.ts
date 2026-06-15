import { Pool } from 'pg';

export async function createUserAccounts(client: Pool) {
  await client.query(`
        DO $$
        BEGIN
            CREATE TYPE account_type AS ENUM ('admin', 'employee', 'user');
        EXCEPTION WHEN duplicate_object THEN null;
        END $$;
    `);

  await client.query(`
        DO $$
        BEGIN
            CREATE TYPE account_status AS ENUM ('active', 'disabled', 'locked');
        EXCEPTION WHEN duplicate_object THEN null;
        END $$;
    `);

  await client.query(`
        CREATE TABLE IF NOT EXISTS user_accounts (
            id SERIAL PRIMARY KEY,
            account_type account_type NOT NULL,
            username VARCHAR(50) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            google_refresh_token TEXT,
            account_status account_status DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);

  await client
    .query(
      `
        CREATE INDEX IF NOT EXISTS idx_account_type ON user_accounts(account_type);
    `,
    )
    .catch(() => {
      // Index may already exist, ignore error
    });

  await client
    .query(
      `
        CREATE INDEX IF NOT EXISTS idx_username ON user_accounts(username);
    `,
    )
    .catch(() => {
      // Index may already exist, ignore error
    });
}
