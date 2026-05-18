import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { OjtService } from '../services/ojt.service';
import { OjtController } from '../controllers/ojt.controller';
import { LogsModule } from './logs.module';

@Module({
  imports: [DatabaseModule, LogsModule],
  exports: [OjtService],
  providers: [OjtService],
  controllers: [OjtController],
})
export class OjtModule {}
