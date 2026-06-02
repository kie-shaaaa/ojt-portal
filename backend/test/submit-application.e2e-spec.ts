import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import multipart from '@fastify/multipart';

jest.setTimeout(60000);

const mockFileUploadsService = {
  uploadAndSave: jest.fn(),
  deleteApplicationFile: jest.fn(),
};

const mockMailerService = {
  confirmationEmail: jest.fn(),
};

describe('ApplicationController (e2e)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider('FileUploadsService') // IMPORTANT: must match actual token
      .useValue(mockFileUploadsService)
      .overrideProvider('MailerService') // IMPORTANT: must match actual token
      .useValue(mockMailerService)
      .compile();

    const fastifyAdapter = new FastifyAdapter({
      bodyLimit: 25 * 1024 * 1024,
    });

    await fastifyAdapter.register(multipart);

    app =
      moduleFixture.createNestApplication<NestFastifyApplication>(
        fastifyAdapter,
      );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should submit application with files (multipart)', async () => {
    mockFileUploadsService.uploadAndSave.mockResolvedValue({ id: 1 });
    mockMailerService.confirmationEmail.mockResolvedValue(true);

    const res = await request(app.getHttpServer())
      .post('/applications/submit')
      .field('applicationType', 'ojt')
      .field('firstName', 'John')
      .field('lastName', 'Doe')
      .field('email', 'john@example.com')
      .field('phone', '9123456789')
      .field('school', 'Test University')
      .field('course', 'BSIT')
      .field('hours', '300')
      .field('deploymentDate', '2026-01-01')
      .field(
        'documents',
        JSON.stringify([
          'resume-cv',
          'picture-1x1',
          'proof-of-enrollment',
          'draft-endorsement',
          'vaccine-card',
        ]),
      )
      .attach('files', Buffer.from('fake file content'), 'resume.pdf');

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('data');

    expect(mockFileUploadsService.uploadAndSave).toHaveBeenCalled();
    expect(mockMailerService.confirmationEmail).toHaveBeenCalled();
  });

  it('should rollback application if file upload fails', async () => {
    mockFileUploadsService.uploadAndSave.mockRejectedValue(
      new Error('upload failed'),
    );

    const res = await request(app.getHttpServer())
      .post('/applications/submit')
      .field('applicationType', 'ojt')
      .field('firstName', 'John')
      .field('lastName', 'Doe')
      .field('email', 'rollback@test.com')
      .field('phone', '9123456789');

    expect(res.status).toBe(400);

    expect(mockFileUploadsService.deleteApplicationFile).toHaveBeenCalled();
  });

  it('should reject duplicate email submission', async () => {
    mockFileUploadsService.uploadAndSave.mockResolvedValue({ id: 1 });
    mockMailerService.confirmationEmail.mockResolvedValue(true);

    await request(app.getHttpServer())
      .post('/applications/submit')
      .field('applicationType', 'ojt')
      .field('firstName', 'John')
      .field('lastName', 'Doe')
      .field('email', 'duplicate@test.com')
      .field('phone', '9123456789');

    const res = await request(app.getHttpServer())
      .post('/applications/submit')
      .field('applicationType', 'ojt')
      .field('firstName', 'John')
      .field('lastName', 'Doe')
      .field('email', 'duplicate@test.com')
      .field('phone', '9123456789');

    expect(res.status).toBe(400);
  });
});
