import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { cert, getApps } from 'firebase-admin/app';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { RedisIoAdapter } from './websockets/redis-io.adapter';

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
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const certObj = require(serviceAccountPath);
      admin.initializeApp({ credential: cert(certObj) });
    } else {
      // Use application default credentials or project ID
      admin.initializeApp({
        projectId: projectId || 'omnidrop-dev',
      });
    }
    logger.log('Firebase Admin SDK initialized');
  } catch (error) {
    logger.warn(`Firebase Admin SDK init warning: ${error.message}`);
    // Initialize with minimal config for development
    if (!getApps().length) {
      admin.initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID || 'omnidrop-dev' });
    }
  }

  const app = await NestFactory.create(AppModule, { rawBody: true });

  // Global prefix
  app.setGlobalPrefix('api');

  // Configure Redis for WebSockets
  const configService = app.get(ConfigService);
  const redisUrl = configService.get('REDIS_URL', 'redis://localhost:6379');
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis(redisUrl);
  app.useWebSocketAdapter(redisIoAdapter);

  // CORS
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
    ],
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
  logger.log(`🚀 Omnidrop API running on http://localhost:${port}`);
  logger.log(`📚 API prefix: /api`);
}

bootstrap();
