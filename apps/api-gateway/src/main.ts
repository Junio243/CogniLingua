import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('CogniLingua API')
    .setDescription('API Gateway do CogniLingua')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.API_GATEWAY_PORT || 3000;
  await app.listen(port);

  console.log(`🚀 API Gateway ouvindo na porta ${port}`);
  console.log(`📚 Swagger disponível em http://localhost:${port}/docs`);
}

bootstrap();
