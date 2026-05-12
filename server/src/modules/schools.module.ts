import { Module } from '@nestjs/common';
import { SchoolsController } from '../controllers/schools.controller';
import { DatabaseModule } from './database.module';
import { SchoolService } from '../services/schools.service';

@Module({
  controllers: [SchoolsController],
  providers: [SchoolService],
  exports: [SchoolService],
  imports: [DatabaseModule],
})
export class SchoolsModule {}
