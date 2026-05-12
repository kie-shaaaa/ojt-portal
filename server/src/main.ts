import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import cookie from '@fastify/cookie';
import rateLimit from '@fastify/rate-limit';
import helmet from '@fastify/helmet';
import multipart from '@fastify/multipart';

import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      bodyLimit: 25 * 1024 * 1024,
    }),
  );

  // MUST register plugins BEFORE app.listen

  await app.register(cookie as any);

  await app.register(helmet as any, {
    global: true,
    contentSecurityPolicy: false,
  });

  await app.register(rateLimit as any, {
    max: 100,
    timeWindow: '1 minute',
  });

  await app.register(multipart as any, {
    attachFieldsToBody: false,
    limits: {
      fileSize: 6 * 1024 * 1024,
    },
  });

  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
    credentials: true,
    methods: ["POST", "PUT", "GET", "PATCH", "DELETE"]
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(process.env.PORT ?? 5000);
}

bootstrap();
