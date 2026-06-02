import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Injectable, Logger } from '@nestjs/common';
import { Readable } from 'stream';
import ws from 'ws';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY =
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY || '';

@Injectable()
export class SupabaseStorage {
  private client: SupabaseClient;
  private readonly logger = new Logger(SupabaseStorage.name);

  constructor() {
    this.client = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      realtime: {
        transport: ws,
      },
    });
  }
  
  // Upload a Buffer to a bucket
  async uploadBuffer(
    bucket: string,
    path: string,
    file: Buffer,
    contentType = 'application/octet-stream',
  ) {
    if (!bucket || !path) throw new Error('bucket and path are required');

    const { data, error } = await this.client.storage
      .from(bucket)
      .upload(path, file, {
        contentType,
        upsert: true,
      });

    if (error) {
      this.logger.error(`Upload error: ${error.message}`, error);

      // Check if the bucket is missing
      if (/bucket not found/i.test(error.message)) {
        this.logger.log(`Creating bucket: ${bucket}`);
        await this.ensureBucketExists(bucket, true);
        const { data: retryData, error: retryError } = await this.client.storage
          .from(bucket)
          .upload(path, file, { contentType, upsert: true });

        if (retryError) throw retryError;
        this.logger.log(`File uploaded successfully: ${path}`);
        return retryData;
      }
      throw error;
    }

    this.logger.log(`File uploaded successfully: ${path}`);
    return data;
  }

  // Upload a Readable stream (Node) to a bucket
  async uploadStream(
    bucket: string,
    path: string,
    stream: NodeJS.ReadableStream,
    contentType = 'application/octet-stream',
  ) {
    if (!bucket || !path) throw new Error('bucket and path are required');

    const chunks: Uint8Array[] = [];

    for await (const chunk of stream as Readable) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
    }

    return await this.uploadBuffer(
      bucket,
      path,
      Buffer.concat(chunks),
      contentType,
    );
  }

  // Ensure bucket exists
  async ensureBucketExists(bucket: string, isPublic = true) {
    const { data, error } = await this.client.storage.createBucket(bucket, {
      public: isPublic,
    });

    if (error && !/already exists/i.test(error.message)) {
      throw error;
    }

    return data || null;
  }

  // Upload a file-like object
  async uploadFile(
    bucket: string,
    path: string,
    file: Buffer | Blob | File,
    opts?: { contentType?: string; upsert?: boolean },
  ) {
    if (!bucket || !path) throw new Error('bucket and path are required');

    const { data, error } = await this.client.storage
      .from(bucket)
      .upload(path, file, {
        contentType: opts?.contentType,
        upsert: opts?.upsert ?? true,
      });

    if (error) throw error;
    return data;
  }

  // Remove object(s)
  async remove(bucket: string, paths: string | string[]) {
    const { data, error } = await this.client.storage
      .from(bucket)
      .remove(Array.isArray(paths) ? paths : [paths]);

    if (error) throw error;
    return data;
  }

  // Get public URL
  getPublicUrl(bucket: string, path: string) {
    const { data } = this.client.storage.from(bucket).getPublicUrl(path);
    return data?.publicUrl || null;
  }

  // Get signed URL
  async getSignedUrl(bucket: string, path: string, expires = 60) {
    const { data, error } = await this.client.storage
      .from(bucket)
      .createSignedUrl(path, expires);

    if (error) throw error;
    return data.signedUrl;
  }

  // List files in a bucket path
  async list(bucket: string, path: string) {
    this.logger.debug(`Listing files in ${bucket}/${path}`);
    return await this.client.storage.from(bucket).list(path);
  }
}

export default SupabaseStorage;
