import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { SupabaseStorage } from '../services/supabase-storage.service';
import { FileUploadsService } from '../services/file-uploads.service';

@Module({
  imports: [DatabaseModule],
  providers: [SupabaseStorage, FileUploadsService],
  exports: [SupabaseStorage, FileUploadsService],
})
export class StorageModule {}
