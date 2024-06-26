import { NestFactory } from '@nestjs/core';
import { AppModule } from '~/app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import fastifyCookie from '@fastify/cookie';

import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import * as process from 'process';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const CORS_OPTIONS = {
  origin: "*", // or '*' or whatever is required
  allowedHeaders: [
    'Access-Control-Allow-Origin',
    'Origin',
    'X-Requested-With',
    'Accept',
    'Content-Type',
    'Authorization',
  ],
  exposedHeaders: 'Authorization',
  credentials: true,
  methods: ['GET', 'PUT', 'OPTIONS', 'POST', 'DELETE'],
};

const port = process.env.APP_PORT || 3001;

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: process.env.NODE_ENV === 'development',
      trustProxy: true
    }),
  );
  // more info https://docs.nestjs.com/techniques/validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.register(fastifyCookie as any, {
    secret: process.env.COOKIE_SECRET || 'cookie-secret',
  });


  app.setGlobalPrefix('/api/v1');

  app.enableCors(CORS_OPTIONS)

  const config = new DocumentBuilder()
    .setTitle('Nestjs api document')
    .setDescription('api document by Swagger')
    .setVersion('1.0')
    .addTag('Nestjs starter docs')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port);
}

bootstrap().then(() => {
  return Logger.log(`This api server is running at: http://localhost:${port}`);
});
