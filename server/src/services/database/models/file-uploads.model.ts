import { Client } from 'pg';

/**
 * FILE_UPLOADS MODEL - Supabase Migration
 *
 * This table is the single source of truth for document metadata.
 * Files are stored in Supabase with naming convention: {file_type}-{application_id}.{extension}
 *
 * Legacy file_path values will be migrated to Supabase bucket paths:
 * Old: /uploads/applications/abc123.pdf
 * New: documents/applicant-{application_id}/{file_type}-{application_id}.{extension}
 */
export async function createFileUploads(client: Client) {
  await client.query(`
        DO $$
        BEGIN
            CREATE TYPE file_type AS ENUM ('ojt_resume', 'job_resume', 'cover_letter', 'other');
        EXCEPTION WHEN duplicate_object THEN null;
        END $$;
    `);

  await client.query(`
        CREATE TABLE IF NOT EXISTS file_uploads (
            id SERIAL PRIMARY KEY,
            application_id INTEGER NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
            file_type file_type NOT NULL,
          document_key VARCHAR(100),
            file_name VARCHAR(255) NOT NULL,
            file_extension VARCHAR(10),
            file_path VARCHAR(500) NOT NULL,
            file_size INTEGER NOT NULL,
            uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);

  await client.query(`
        ALTER TABLE file_uploads
        ADD COLUMN IF NOT EXISTS document_key VARCHAR(100);
      `);

  await client
    .query(
      `
        CREATE INDEX IF NOT EXISTS idx_application_id ON file_uploads(application_id);
    `,
    )
    .catch(() => {});

  await client
    .query(
      `
        CREATE INDEX IF NOT EXISTS idx_file_type ON file_uploads(file_type);
    `,
    )
    .catch(() => {});

  await client
    .query(
      `
        CREATE INDEX IF NOT EXISTS idx_document_key ON file_uploads(document_key);
    `,
    )
    .catch(() => {});
}
