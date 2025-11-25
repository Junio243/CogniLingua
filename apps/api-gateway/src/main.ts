import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
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

  const config = new DocumentBuilder()
    .setTitle('CogniLingua API')
    .setDescription('API Gateway do CogniLingua')
    .setVersion('1.0')
    .addServer('/v1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.API_GATEWAY_PORT || 3000;
  await app.listen(port);

  logger.log(`🚀 API Gateway ouvindo na porta ${port}`);
  logger.log(`📚 Swagger disponível em http://localhost:${port}/docs`);
}

bootstrap();
