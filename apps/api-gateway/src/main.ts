import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
  }

  const port = process.env.API_GATEWAY_PORT || 3000;
  await app.listen(port);

  console.log(`🚀 API Gateway ouvindo na porta ${port}`);
  if (enableSwagger) {
    console.log(`📚 Swagger disponível em http://localhost:${port}/docs`);
  } else {
    console.log('📚 Swagger desabilitado (ENABLE_SWAGGER=false)');
  }
}

bootstrap();
