import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { CoursesController } from '../controllers/courses.controller';
import { CourseService } from '../services/courses.service';
import { LogsModule } from './logs.module';

@Module({
  controllers: [CoursesController],
  providers: [CourseService],
  exports: [CourseService],
  imports: [DatabaseModule, LogsModule],
})
export class CoursesModule {}
