import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { SupabaseStorage } from './supabase-storage.service';
import { UploadedFile } from '../data/types/file-upload.types';
import { DatabaseService } from './database/database.service';

export interface FileUploadData {
  application_id: number;
  file_type: 'ojt_resume' | 'job_resume' | 'cover_letter' | 'other';
  file_name: string;
  file_extension?: string;
  file_size: number;
}

export interface FileUploadResult {
  id: number;
  application_id: number;
  file_type: string;
  file_name: string;
  file_extension: string;
  file_path: string;
  file_size: number;
  uploaded_at: string;
}

@Injectable()
export class FileUploadsService {
  private readonly logger = new Logger(FileUploadsService.name);
  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private readonly ALLOWED_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/jpg',
  ];
  private readonly SUPABASE_BUCKET = 'documents';

  constructor(
    private readonly supabaseService: SupabaseStorage,
    private readonly dbService: DatabaseService,
  ) {}

  /**
   * Validate file before upload
   */
  validateFile(file: UploadedFile | null | undefined): void {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (file.size > this.MAX_FILE_SIZE) {
      throw new BadRequestException(
        `File size exceeds limit: ${(file.size / 1024 / 1024).toFixed(2)}MB (max ${(this.MAX_FILE_SIZE / 1024 / 1024).toFixed(0)}MB)`,
      );
    }

    if (!this.ALLOWED_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        `File type not allowed: ${file.mimetype}. Allowed: ${this.ALLOWED_TYPES.join(', ')}`,
      );
    }
  }

  /**
   * Upload file to Supabase and save metadata to database
   */
  async uploadAndSave(
    file: UploadedFile | undefined,
    fileData: FileUploadData,
  ): Promise<FileUploadResult> {
    try {
      // Step 1: Validate file
      this.validateFile(file);

      // Type guard: file is now guaranteed to be defined
      if (!file) {
        throw new BadRequestException('File validation failed');
      }

      // Step 2: Extract file extension
      const fileExtension = this.getFileExtension(file.originalname);

      // Step 3: Generate Supabase file path
      const fileName = `${fileData.file_type}-${fileData.application_id}.${fileExtension}`;
      const filePath = `applicant-${fileData.application_id}/${fileName}`;

      // Step 4: Upload to Supabase
      this.logger.log(`Uploading file: ${filePath}`);
      await this.supabaseService.uploadBuffer(
        this.SUPABASE_BUCKET,
        filePath,
        file.buffer,
        file.mimetype,
      );

      // Step 5: Save metadata to database
      const result = await this.saveFileMetadata({
        application_id: fileData.application_id,
        file_type: fileData.file_type,
        file_name: file.originalname,
        file_extension: fileExtension,
        file_path: filePath,
        file_size: file.size,
      });

      this.logger.log(`File saved to database: ID ${result.id}`);
      return result;
    } catch (error) {
      this.logger.error(`File upload failed: ${error}`, error);
      throw error;
    }
  }

  /**
   * Save file metadata to database
   */
  private async saveFileMetadata(data: {
    application_id: number;
    file_type: string;
    file_name: string;
    file_extension: string;
    file_path: string;
    file_size: number;
  }): Promise<FileUploadResult> {
    const dbClient = this.dbService.getClient();
    const query = `
      INSERT INTO file_uploads 
        (application_id, file_type, file_name, file_extension, file_path, file_size, uploaded_at)
      VALUES 
        ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING id, application_id, file_type, file_name, file_extension, file_path, file_size, uploaded_at
    `;

    const result = await dbClient.query(query, [
      data.application_id,
      data.file_type,
      data.file_name,
      data.file_extension,
      data.file_path,
      data.file_size,
    ]);

    return result.rows[0] as FileUploadResult;
  }

  /**
   * Get all files for an application
   */
  async getApplicationFiles(
    applicationId: number,
  ): Promise<FileUploadResult[]> {
    const dbClient = this.dbService.getClient();
    const query = `
      SELECT id, application_id, file_type, file_name, file_extension, file_path, file_size, uploaded_at
      FROM file_uploads
      WHERE application_id = $1
      ORDER BY uploaded_at DESC
    `;

    const result = await dbClient.query(query, [applicationId]);
    return result.rows as FileUploadResult[];
  }

  /**
   * Get public URL for a file
   */
  getPublicUrl(filePath: string): string {
    return (
      this.supabaseService.getPublicUrl(this.SUPABASE_BUCKET, filePath) || ''
    );
  }

  /**
   * Get signed URL for a file (expires in 1 hour)
   */
  async getSignedUrl(
    filePath: string,
    expiresIn: number = 3600,
  ): Promise<string> {
    return await this.supabaseService.getSignedUrl(
      this.SUPABASE_BUCKET,
      filePath,
      Math.floor(expiresIn / 60), // Supabase expects seconds
    );
  }

  /**
   * Delete file from Supabase and database
   */
  async deleteFile(fileId: number): Promise<void> {
    try {
      const dbClient = this.dbService.getClient();
      // Step 1: Get file path from database
      const result = await dbClient.query(
        'SELECT file_path FROM file_uploads WHERE id = $1',
        [fileId],
      );

      if (result.rows.length === 0) {
        throw new BadRequestException('File not found');
      }

      const filePath = result.rows[0].file_path;

      // Step 2: Delete from Supabase
      await this.supabaseService.remove(this.SUPABASE_BUCKET, filePath);

      // Step 3: Delete from database
      await dbClient.query('DELETE FROM file_uploads WHERE id = $1', [fileId]);

      this.logger.log(`File deleted: ${filePath}`);
    } catch (error) {
      this.logger.error(`File deletion failed: ${error}`, error);
      throw error;
    }
  }

  /**
   * Extract file extension from filename
   */
  private getFileExtension(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase() || 'pdf';
    return ext;
  }
}
