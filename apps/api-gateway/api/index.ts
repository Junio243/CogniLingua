import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';
import { LoggingInterceptor } from '../src/common/interceptors/logging.interceptor';
import { ResponseInterceptor } from '../src/common/interceptors/response.interceptor';
import { Request, Response } from 'express';

let server: any;

async function bootstrapServer() {
  if (server) {
    return server;
  }

  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.setGlobalPrefix('v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter(logger));
  app.useGlobalInterceptors(new ResponseInterceptor(), new LoggingInterceptor());

  const enableSwagger = process.env.ENABLE_SWAGGER !== 'false';

  if (enableSwagger) {
    if (
      process.env.NODE_ENV === 'production' &&
      process.env.SWAGGER_BASIC_AUTH_USER &&
      process.env.SWAGGER_BASIC_AUTH_PASSWORD
    ) {
      app.use(['/docs', '/docs-json'], (req, res, next) => {
        const header = req.headers.authorization;

        if (!header || !header.startsWith('Basic ')) {
          res.set('WWW-Authenticate', 'Basic realm="API Docs"');
          return res.status(401).send('Authentication required');
        }

        const credentials = Buffer.from(header.split(' ')[1], 'base64')
          .toString()
          .split(':');

        if (
          credentials[0] === process.env.SWAGGER_BASIC_AUTH_USER &&
          credentials[1] === process.env.SWAGGER_BASIC_AUTH_PASSWORD
        ) {
          return next();
        }

        res.set('WWW-Authenticate', 'Basic realm="API Docs"');
        return res.status(401).send('Access denied');
      });
    }

    const config = new DocumentBuilder()
      .setTitle('CogniLingua API')
      .setDescription('API Gateway do CogniLingua')
      .setVersion('1.0')
      .addTag('Learning')
      .addTag('Curriculum')
      .addTag('Spanish')
      .addServer('/v1')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
  }

  await app.init();
  server = app.getHttpAdapter().getInstance();
  logger.log('🚀 API Gateway inicializado');
  return server;
}

export default async function handler(req: Request, res: Response) {
  const app = await bootstrapServer();
  return app(req, res);
}
