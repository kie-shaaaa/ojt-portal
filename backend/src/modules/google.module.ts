import { Module } from '@nestjs/common';
import { GoogleService } from '../services/google.service';
import { GoogleController } from '../controllers/google.controller';
import { DatabaseModule } from './database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [GoogleController],
  providers: [GoogleService],
  exports: [GoogleService],
})
export class GoogleModule {}
