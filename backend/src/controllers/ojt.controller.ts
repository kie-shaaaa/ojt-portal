import {
  Body,
  Controller,
  Delete,
  Get,
  Put,
  Query,
  BadRequestException,
  ParseIntPipe,
} from '@nestjs/common';
import { OjtService } from '../services/ojt.service';
import { SuccessResponse } from '../data/types';
import type { UpdateOjtDto } from '../data/dto/update-ojt.dto';

@Controller('ojt')
export class OjtController {
  constructor(private readonly ojtService: OjtService) {}

  @Get('fetch-all')
  async fetchAllOjt(
    @Query('count', ParseIntPipe) count: number,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
  ) {
    try {
      return await this.ojtService.getOjt(count, page || 1);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch OJT records';
      throw new BadRequestException(message);
    }
  }

  @Put('edit-Ojt')
  async editOjt(@Body() body: UpdateOjtDto): Promise<SuccessResponse> {
    try {
      return await this.ojtService.updateOjt(body);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to update OJT';
      throw new BadRequestException(message);
    }
  }

  @Delete('delete')
  async deleteOjt(@Body() id: number): Promise<SuccessResponse> {
    try {
      return await this.ojtService.deleteOjt(id);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to delete OJT';
      throw new BadRequestException(message);
    }
  }
}
