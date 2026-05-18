import { Module } from '@nestjs/common';
import { SchoolsController } from '../controllers/schools.controller';
import { DatabaseModule } from './database.module';
import { SchoolService } from '../services/schools.service';
import { LogsModule } from './logs.module';

@Module({
  controllers: [SchoolsController],
  providers: [SchoolService],
  exports: [SchoolService],
  imports: [DatabaseModule, LogsModule],
})
export class SchoolsModule {}
