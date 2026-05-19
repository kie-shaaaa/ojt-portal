import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { LogsService } from '../services/logs.service';
import { FetchAllLogs } from '../data/types';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get('fetch-all')
  async getLogs(
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ): Promise<FetchAllLogs> {
    try {
      return await this.logsService.fetchAllLogs(Number(limit), Number(page));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch all logs';
      throw new BadRequestException(message);
    }
  }
}
