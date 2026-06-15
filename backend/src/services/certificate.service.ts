/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import pLimit from 'p-limit';
import { PassThrough } from 'stream';
import { DatabaseService } from './database/database.service';
import { throwAppError } from '../utils/handlers';

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

const templateId = process.env.GOOGLE_TEMPLATE_ID;

if (!templateId) {
  throw new Error('GOOGLE_TEMPLATE_ID is not defined in environment variables');
}

@Injectable()
export class CertificateService {
  constructor(private readonly databaseService: DatabaseService) {}

  // =========================
  // 1. FETCH OJT DATA ONLY
  // =========================
  async getOjtInfo(ojtIds: string[]) {
    const client = this.databaseService.getClient();

    try {
      const res = await client.query(
        `
      SELECT 
        first_name,
        last_name,
        school_name,
        course,
        hours_needed,
        confirmed_at,
        end_date
      FROM ojt_data
      WHERE id = ANY($1)
      `,
        [ojtIds],
      );

      return res.rows.map((row) => ({
        name: `${row.first_name} ${row.last_name}`,
        program: row.course,
        school: row.school_name,
        hours: row.hours_needed,
        startDate: row.confirmed_at,
        endDate: row.end_date,
      }));
    } catch (error) {
      console.error('[CertificateService] Failed to get OJT info:', error);
      throwAppError('server_error', 'Failed to retrieve OJT information');
    }
  }

  // =========================
  // 2. SINGLE CERT GENERATION
  // =========================
  async generateCertificatePdf(
    data: {
      name: string;
      program: string;
      school: string;
      hours: number;
      startDate: Date;
      endDate: Date;
    },
    templateId: string,
    authClient: any,
  ) {
    const drive = google.drive({ version: 'v3', auth: authClient });
    const slides = google.slides({ version: 'v1', auth: authClient });

    let presentationId: string | null = null;

    try {
      // 1. Copy template
      const copy = await drive.files.copy({
        fileId: templateId,
        requestBody: {
          name: `TEMP-${data.name}`,
        },
      });

      presentationId = copy.data.id!;

      // allow Google propagation
      await sleep(1000);

      // 2. Replace text
      await slides.presentations.batchUpdate({
        presentationId,
        requestBody: {
          requests: [
            {
              replaceAllText: {
                containsText: { text: '{{NAME}}', matchCase: true },
                replaceText: data.name,
              },
            },
            {
              replaceAllText: {
                containsText: { text: '{{PROGRAM}}', matchCase: true },
                replaceText: data.program,
              },
            },
            {
              replaceAllText: {
                containsText: { text: '{{SCHOOL}}', matchCase: true },
                replaceText: data.school,
              },
            },
            {
              replaceAllText: {
                containsText: { text: '{{HOURS}}', matchCase: true },
                replaceText: String(data.hours),
              },
            },
            {
              replaceAllText: {
                containsText: { text: '{{STARTDATE}}', matchCase: true },
                replaceText: formatDate(data.startDate),
              },
            },
            {
              replaceAllText: {
                containsText: { text: '{{ENDDATE}}', matchCase: true },
                replaceText: formatDate(data.endDate),
              },
            },
          ],
        },
      });

      // 3. Export PDF
      const pdf = await drive.files.export(
        {
          fileId: presentationId,
          mimeType: 'application/pdf',
        },
        { responseType: 'arraybuffer' },
      );

      return Buffer.from(pdf.data as ArrayBuffer);
    } catch (error) {
      console.error('[CertificateService] Generation failed:', error);
      throwAppError('server_error', 'Failed to generate certificate');
    }
  }

  // =========================
  // 3. BULK GENERATION
  // =========================
  async generateBulkCertificates(
    ojts: {
      name: string;
      program: string;
      school: string;
      hours: number;
      startDate: Date;
      endDate: Date;
    }[],
    templateId: string,
    authClient: any,
  ) {
    const limit = pLimit(2);

    const buffers = await Promise.all(
      ojts.map((ojt) =>
        limit(() => this.generateCertificatePdf(ojt, templateId, authClient)),
      ),
    );

    return this.createZip(
      ojts.map((ojt, i) => ({
        name: ojt.name,
        buffer: buffers[i] as Buffer | undefined,
      })),
    );
  }

  // =========================
  // 4. ZIP CREATION
  // =========================
  async createZip(files: { name: string; buffer: Buffer | undefined }[]) {
    const { ZipArchive } = require('archiver');

    const archive = new ZipArchive({ zlib: { level: 9 } });

    const stream = new PassThrough();
    archive.pipe(stream);

    for (const file of files) {
      if (!file.buffer) continue;
      archive.append(file.buffer, { name: `${file.name}.pdf` });
    }

    await archive.finalize();
    return stream;
  }

  // =========================
  // 5. ORCHESTRATION ENTRY
  // =========================
  async generateFromOjtIds(ojtIds: string[], authClient: any) {
    const ojts = await this.getOjtInfo(ojtIds);

    return this.generateBulkCertificates(ojts, templateId!, authClient);
  }
}
