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
        CREATE TABLE IF NOT EXISTS appointments (
            id SERIAL PRIMARY KEY,
            type appointment_type,
            is_done BOOLEAN DEFAULT FALSE,
            is_cancelled BOOLEAN DEFAULT FALSE,
            application_id INT REFERENCES applications(id),
            appointment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
}
