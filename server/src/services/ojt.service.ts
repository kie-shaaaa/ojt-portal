import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { AllOjt } from '../data/types';

@Injectable()
export class OjtService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getOjt(count: number) {
    const client = this.databaseService.getClient();
    try {
      if (count < 1) return null;

      const res = await client.query<AllOjt>(
        `
                SELECT * FROM ojt_data LIMIT $1
            `,
        [count],
      );

      return {
        ok: true,
        message: 'OJT data fetched successfully',
        data: res.rows || [],
      };
    } catch (error: unknown) {
      return {
        error,
        message: 'Failed to fetch OJT data',
        ok: false,
      };
    }
  }
}
