import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NextFunction, Request, Response } from 'express';
import * as admin from 'firebase-admin';
import { cert, getApps } from 'firebase-admin/app';
import { AppModule } from './app.module';
import { getErrorMessage } from './common/errors';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // Initialize Firebase Admin SDK
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

    if (projectId && clientEmail && privateKey) {
      // Initialize with separate env variables (recommended for PaaS like Render)
      admin.initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    } else if (serviceAccountPath) {
      // Fallback to service account json file path
      admin.initializeApp({ credential: cert(serviceAccountPath) });
    } else {
      // Use application default credentials or project ID
      admin.initializeApp({
        projectId: projectId || 'omnidrop-dev',
      });
    }
  } catch (error) {
    logger.warn(`Firebase Admin SDK init warning: ${getErrorMessage(error)}`);
    // Initialize with minimal config for development
    if (!getApps().length) {
      admin.initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID || 'omnidrop-dev' });
    }
  }

  const app = await NestFactory.create(AppModule, { rawBody: true });

  // Security Headers Middleware
  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    if (process.env.NODE_ENV === 'production') {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    next();
  });

  // Global prefix
  app.setGlobalPrefix('api');

  // CORS
  const configuredOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
    : [];
  const defaultOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://localhost:8081',
    'http://localhost:19006',
  ];
  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      const allowedOrigins = [...defaultOrigins, ...configuredOrigins];
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.netlify.app') ||
        origin.endsWith('.vercel.app')
      ) {
        return callback(null, true);
      }
      // In development fallback to allow origin
      if (process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(new Error('Blocked by CORS policy'));
    },
    credentials: true,
  });

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global filters & interceptors
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  const port = process.env.PORT || 4000;
  await app.listen(port);
  logger.log(`Omnidrop API running at http://localhost:${port}/api`);
}

void bootstrap();
