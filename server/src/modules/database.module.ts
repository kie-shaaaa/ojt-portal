import { Module } from '@nestjs/common';
import { DatabaseService } from '../services/database/database.service';

@Module({
  exports: [DatabaseService],
  providers: [DatabaseService],
})
export class DatabaseModule {}
