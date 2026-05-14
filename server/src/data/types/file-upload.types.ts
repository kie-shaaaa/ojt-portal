/**
 * File upload types compatible with both Express and Fastify
 */

export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

export type MultipartFile = UploadedFile;
