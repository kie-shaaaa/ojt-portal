import { Body, Controller, Delete, Get, Query } from '@nestjs/common';
import { OjtService } from '../services/ojt.service';
import { SuccessResponse } from '../data/types';

@Controller('ojt')
export class OjtController {
  constructor(private readonly ojtService: OjtService) {}

  @Get('fetch-all')
  async fetchAllOjt(@Query('count') count: number) {
    return this.ojtService.getOjt(count || 0);
  }

  @Delete('delete')
  async deleteApplication(@Body() id: number): Promise<SuccessResponse> {
    return await this.ojtService.deleteOjt(id);
  }
}
