import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { LogsService } from '../services/logs.service';
import { LogsController } from '../controllers/logs.controller';

@Module({
  imports: [DatabaseModule],
  exports: [LogsService],
  providers: [LogsService],
  controllers: [LogsController],
})
export class LogsModule {}