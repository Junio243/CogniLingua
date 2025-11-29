import { RequestMethod, ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.setGlobalPrefix('v1', {
    exclude: [{ path: '/', method: RequestMethod.ALL }],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter(logger));
  app.useGlobalInterceptors(new ResponseInterceptor(), new LoggingInterceptor());

  // Configuração condicional do Swagger
  const enableSwagger = process.env.ENABLE_SWAGGER !== 'false';

  if (enableSwagger) {
    // Configuração de autenticação básica para produção
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

    // Configuração do DocumentBuilder com tags específicas
    const config = new DocumentBuilder()
      .setTitle('CogniLingua API')
      .setDescription('API Gateway do CogniLingua')
      .setVersion('1.0')
      .addTag('Learning') // Adiciona a tag Learning
      .addTag('Curriculum') // Adiciona a tag Curriculum
      .addTag('Spanish') // Adiciona a tag Spanish
      .addServer('/v1') // Define o servidor base
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: { persistAuthorization: true }, // Persiste o token de autorização na UI
    });
  }

  const port = process.env.API_GATEWAY_PORT || 3000;
  await app.listen(port);

  // Mensagens de log condicionais
  if (enableSwagger) {
    logger.log(`🚀 API Gateway ouvindo na porta ${port}`);
    logger.log(`📚 Swagger disponível em http://localhost:${port}/docs`);
  } else {
    logger.log(`🚀 API Gateway ouvindo na porta ${port}`);
    logger.log('📚 Swagger desabilitado (ENABLE_SWAGGER=false)');
  }
}

bootstrap();