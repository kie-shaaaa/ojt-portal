import { Pool } from 'pg';

export async function createOjtData(client: Pool) {
  await client.query(`
        DO $$
        BEGIN
            CREATE TYPE gender AS ENUM ('Male', 'Female');
        EXCEPTION WHEN duplicate_object THEN null;
        END $$;
    `);

  await client.query(`
        CREATE TABLE IF NOT EXISTS ojt_data (
            id SERIAL PRIMARY KEY,
            application_type VARCHAR(50) NOT NULL,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            gender gender,
            email VARCHAR(100) NOT NULL,
            phone VARCHAR(20) NOT NULL,
            school_name VARCHAR(200),
            hours_needed INTEGER,
            course VARCHAR(200),
            deployment_date DATE,
            end_date DATE,
            certificate_issuance_date DATE,
            orientation_date VARCHAR(100),
            confirmed_at TIMESTAMP,
            confirmation_ip VARCHAR(45),
            second_chance SMALLINT DEFAULT 0,
            submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            original_status VARCHAR(50),
            moved_to_ojt_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            admin_notes TEXT
        );
    `);

  await client
    .query(`CREATE INDEX IF NOT EXISTS idx_email ON ojt_data(email);`)
    .catch(() => {});
  await client
    .query(
      `CREATE INDEX IF NOT EXISTS idx_confirmed_at ON ojt_data(confirmed_at);`,
    )
    .catch(() => {});
  await client
    .query(
      `CREATE INDEX IF NOT EXISTS idx_application_id ON ojt_data(application_id);`,
    )
    .catch(() => {});
  await client
    .query(
      `CREATE INDEX IF NOT EXISTS idx_deployment_date ON ojt_data(deployment_date);`,
    )
    .catch(() => {});
  await client
    .query(`CREATE INDEX IF NOT EXISTS idx_end_date ON ojt_data(end_date);`)
    .catch(() => {});
  await client
    .query(
      `CREATE INDEX IF NOT EXISTS idx_certificate_issuance_date ON ojt_data(certificate_issuance_date);`,
    )
    .catch(() => {});
  await client
    .query(`CREATE INDEX IF NOT EXISTS idx_ojt_id ON ojt_data(ojt_id);`)
    .catch(() => {});
  await client
    .query(`CREATE INDEX IF NOT EXISTS idx_gender ON ojt_data(gender);`)
    .catch(() => {});
  await client
    .query(
      `CREATE INDEX IF NOT EXISTS idx_second_chance ON ojt_data(second_chance);`,
    )
    .catch(() => {});
}
