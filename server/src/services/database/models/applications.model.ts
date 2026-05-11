import { Client } from 'pg';

export async function createApplications(client: Client) {
  await client.query(`
        DO $$
        BEGIN
            CREATE TYPE application_status AS ENUM ('pending', 'under_review', 'rejected', 'for_interview', 'accepted');
        EXCEPTION WHEN duplicate_object THEN null;
        END $$;
    `);

  await client.query(`
        CREATE TABLE IF NOT EXISTS applications (
            id SERIAL PRIMARY KEY,
            application_type VARCHAR(50) NOT NULL,
            other_application_type VARCHAR(100),
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL,
            phone VARCHAR(20) NOT NULL,
            school_name VARCHAR(200),
            hours_needed INTEGER,
            course VARCHAR(200),
            deployment_date DATE,
            position_applied VARCHAR(200),
            years_experience DECIMAL(4,1),
            current_company VARCHAR(200),
            salary_expectation DECIMAL(12,2),
            available_date DATE,
            agreed_terms BOOLEAN DEFAULT FALSE,
            submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            status application_status DEFAULT 'pending',
            admin_notes TEXT,
            reviewed_by INTEGER REFERENCES user_accounts(id) ON DELETE SET NULL,
            reviewed_date TIMESTAMP,
            ojt_resume_size INTEGER,
            job_resume_size INTEGER,
            cover_letter_size INTEGER,
            ojt_resume_name VARCHAR(255),
            job_resume_name VARCHAR(255),
            cover_letter_name VARCHAR(255)
        ); 
    `);

  await client
    .query(
      `
        CREATE INDEX IF NOT EXISTS idx_email ON applications(email);
    `,
    )
    .catch(() => {});

  await client
    .query(
      `
        CREATE INDEX IF NOT EXISTS idx_status ON applications(status);
    `,
    )
    .catch(() => {});

  await client
    .query(
      `
        CREATE INDEX IF NOT EXISTS idx_submission_date ON applications(submission_date);
    `,
    )
    .catch(() => {});

  await client
    .query(
      `
        CREATE INDEX IF NOT EXISTS idx_application_type ON applications(application_type);
    `,
    )
    .catch(() => {});

  await client
    .query(
      `
        CREATE INDEX IF NOT EXISTS idx_name ON applications(last_name, first_name);
    `,
    )
    .catch(() => {});
}
