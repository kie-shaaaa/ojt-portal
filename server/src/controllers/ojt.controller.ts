import { Controller, Get, Query } from '@nestjs/common';
import { OjtService } from '../services/ojt.service';

@Controller('ojt')
export class OjtController {
  constructor(private readonly ojtService: OjtService) {}

  @Get('fetch-all')
  async fetchAllOjt(@Query('count') count: number) {
    return this.ojtService.getOjt(count || 0);
  }
}
