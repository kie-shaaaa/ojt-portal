import { Client } from 'pg';

export async function createAppointment(client: Client) {
    await client.query(`
        DO $$
        BEGIN
            CREATE TYPE appointment_type AS ENUM ('services', 'interview', 'complaints');
        EXCEPTION WHEN duplicate_object THEN null;
        END $$;
    `)

    await client.query(`
        CREATE TABLE IF NOT EXISTS appointments (
            id SERIAL PRIMARY KEY,
            type appointment_type,
            is_done BOOLEAN DEFAULT FALSE,
            appointment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `)
}