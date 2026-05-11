import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { OjtService } from '../services/ojt.service';
import { OjtController } from '../controllers/ojt.controller';

@Module({
  imports: [DatabaseModule],
  exports: [OjtService],
  providers: [OjtService],
  controllers: [OjtController],
})
export class OjtModule {}
