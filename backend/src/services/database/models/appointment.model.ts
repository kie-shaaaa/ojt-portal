import { Pool } from 'pg';

export async function createAppointment(client: Pool) {
  await client.query(`
        DO $$
        BEGIN
            CREATE TYPE appointment_type AS ENUM ('services', 'interview', 'complaints', 'orientation');
        EXCEPTION WHEN duplicate_object THEN null;
        END $$;
    `);

  await client.query(`
        DO $$
        BEGIN
            CREATE TYPE reschedule_status AS ENUM ('pending', 'approved', 'rejected');
        EXCEPTION WHEN duplicate_object THEN null;
        END $$;
    `);

  await client.query(`
        CREATE TABLE IF NOT EXISTS appointments (
            id SERIAL PRIMARY KEY,
            type appointment_type,
            is_done BOOLEAN DEFAULT FALSE,
            is_cancelled BOOLEAN DEFAULT FALSE,
            has_rescheduled BOOLEAN DEFAULT FALSE,
            reschedule_count INT DEFAULT 0,
            appointment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            pending_reschedule_date TIMESTAMP NULL,
            pending_reschedule_status reschedule_status NULL,
            pending_reschedule_requested_at TIMESTAMP NULL,
            application_id INT REFERENCES applications(id) ON DELETE CASCADE
        )
    `);

  await client.query(`
        ALTER TABLE appointments
        ADD COLUMN IF NOT EXISTS reschedule_count INT DEFAULT 0,
        ADD COLUMN IF NOT EXISTS pending_reschedule_date TIMESTAMP NULL,
        ADD COLUMN IF NOT EXISTS pending_reschedule_status reschedule_status NULL,
        ADD COLUMN IF NOT EXISTS pending_reschedule_requested_at TIMESTAMP NULL
    `);
}
