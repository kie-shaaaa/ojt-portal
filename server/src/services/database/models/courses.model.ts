import { Client } from 'pg';

export async function createCourses(client: Client) {
  await client.query(`
        CREATE TABLE IF NOT EXISTS courses (
            id SERIAL PRIMARY KEY,
            course_name VARCHAR(400)
        );
    `);
}
