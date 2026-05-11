import { Client } from 'pg';

export async function createSchool(client: Client) {
  await client.query(`
        CREATE TABLE IF NOT EXISTS school (
            id SERIAL PRIMARY KEY,
            school VARCHAR(255) NOT NULL
        );
    `);
}
