import { Module, forwardRef } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { SupabaseStorage } from '../services/supabase-storage.service';
import { FileUploadsService } from '../services/file-uploads.service';
import { LogsModule } from './logs.module';
import { ApplicationsModule } from './applications.module';
import { MailerModule } from './mailer.module';

@Module({
  imports: [
    DatabaseModule,
    LogsModule,
    forwardRef(() => ApplicationsModule),
    MailerModule,
  ],
  providers: [SupabaseStorage, FileUploadsService],
  exports: [SupabaseStorage, FileUploadsService],
})
export class StorageModule {}
