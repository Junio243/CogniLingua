import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('CognitiveAnalyzerBootstrap');
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.setGlobalPrefix('cognitive-analyzer');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const port = process.env.COGNITIVE_ANALYZER_PORT || 4010;
  await app.listen(port);
  logger.log(`🚀 Cognitive Analyzer listening on port ${port}`);
}

bootstrap();
