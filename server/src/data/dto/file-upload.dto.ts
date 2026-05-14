import { IsNumber, IsEnum, IsString, IsOptional } from 'class-validator';

export enum FileType {
  OJT_RESUME = 'ojt_resume',
  JOB_RESUME = 'job_resume',
  COVER_LETTER = 'cover_letter',
  OTHER = 'other',
}

export class FileUploadDto {
  @IsNumber()
  application_id: number;

  @IsEnum(FileType)
  file_type: FileType;

  @IsString()
  file_name: string;

  @IsOptional()
  @IsString()
  file_extension?: string;

  @IsNumber()
  file_size: number;
}

export class BatchFileUploadDto {
  files: FileUploadDto[];
}
