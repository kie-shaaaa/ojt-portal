import { Module } from '@nestjs/common';
import { SupabaseStorage } from './supabase-storage.service';
import { FileUploadsService } from './file-uploads.service';
import { DatabaseService } from './database/database.service';

@Module({
  providers: [SupabaseStorage, FileUploadsService, DatabaseService],
  exports: [SupabaseStorage, FileUploadsService],
})
export class StorageModule {}
