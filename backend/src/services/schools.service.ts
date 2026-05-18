import { Injectable } from "@nestjs/common";
import { DatabaseService } from "./database/database.service";
import { Schools } from "../data/types";

@Injectable()
export class SchoolService {
    constructor(private readonly databaseService: DatabaseService) {}
    async getAllSchools(count: number) {
        const client = this.databaseService.getClient();
        try {
            if (count < 1) return null;
            
            const res = await client.query<Schools>(`
                SELECT * FROM schools LIMIT $1
            `, [count]);

            return {
                ok: true,
                message: 'School data fetched successfully',
                data: res.rows || []
            };
        } catch (error: unknown) {
            return {
                error,
                message: 'Failed to fetch School Data',
                ok: false,
            };
        }
    }

    async insertSchool(school: string) {
        const client = this.databaseService.getClient();
        try {
            if (!school) return null;

            const inser = await client.query(`
                INSERT INTO schools (school_name)
                VALUES ($1)
                RETURN *
            `, [school]);

            return {
                ok: true,
                message: 'School has been inserted'
            }
        } catch (error: unknown) {
            return {
              error,
              message: 'Failed to insert School Data',
              ok: false,
            };
        }
    }
}