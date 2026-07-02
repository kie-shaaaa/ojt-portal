import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LogsService } from '../services/logs.service';
import { FetchAllLogs } from '../data/types';
import { AuthGuard } from '@nestjs/passport';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get('fetch-all')
  @UseGuards(AuthGuard('jwt'))
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
