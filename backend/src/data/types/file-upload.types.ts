/**
 * File upload types compatible with both Express and Fastify
 */

export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  // Disk-backed path (when files are streamed to temp files)
  path?: string;
  // In-memory buffer (if used)
  buffer?: Buffer;
  size: number;
  // Optional cleanup callback to remove a temp file when finished
  cleanup?: () => void;
}

export type MultipartFile = UploadedFile;
