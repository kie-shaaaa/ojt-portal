import { Client } from 'pg';

export async function createAppointment(client: Client) {
    client.query(`
        CREATE TABLE IF NOT EXISTS appointments (
        )
    `)
}