import { Module } from '@nestjs/common';
import { SupabaseStorage } from '../services/supabase-storage.service';
import { FileUploadsService } from '../services/file-uploads.service';
import { DatabaseService } from '../services/database/database.service';

@Module({
  providers: [SupabaseStorage, FileUploadsService, DatabaseService],
  exports: [SupabaseStorage, FileUploadsService],
})
export class StorageModule {}
