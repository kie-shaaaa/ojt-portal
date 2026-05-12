import { Module } from '@nestjs/common';
import { SupabaseStorageService } from './supabase-storage.service';
import { FileUploadsService } from './file-uploads.service';
import { DatabaseService } from './database/database.service';

@Module({
  providers: [SupabaseStorageService, FileUploadsService, DatabaseService],
  exports: [SupabaseStorageService, FileUploadsService],
})
export class StorageModule {}
