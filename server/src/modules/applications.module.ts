import { Module } from '@nestjs/common';
import { ApplicationsService } from '../services/applications.service';
import { ApplicationsController } from '../controllers/applications.controller';

@Module({
  imports: [],
  exports: [ApplicationsService],
  providers: [ApplicationsService],
  controllers: [ApplicationsController],
})
export class ApplicationsModule {}
