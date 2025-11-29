"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const all_exceptions_filter_1 = require("./common/filters/all-exceptions.filter");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
const response_interceptor_1 = require("./common/interceptors/response.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const logger = new common_1.Logger('Bootstrap');
    app.setGlobalPrefix('v1');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter(logger));
    app.useGlobalInterceptors(new response_interceptor_1.ResponseInterceptor(), new logging_interceptor_1.LoggingInterceptor());
    const enableSwagger = process.env.ENABLE_SWAGGER !== 'false';
    if (enableSwagger) {
        if (process.env.NODE_ENV === 'production' &&
            process.env.SWAGGER_BASIC_AUTH_USER &&
            process.env.SWAGGER_BASIC_AUTH_PASSWORD) {
            app.use(['/docs', '/docs-json'], (req, res, next) => {
                const header = req.headers.authorization;
                if (!header || !header.startsWith('Basic ')) {
                    res.set('WWW-Authenticate', 'Basic realm="API Docs"');
                    return res.status(401).send('Authentication required');
                }
                const credentials = Buffer.from(header.split(' ')[1], 'base64')
                    .toString()
                    .split(':');
                if (credentials[0] === process.env.SWAGGER_BASIC_AUTH_USER &&
                    credentials[1] === process.env.SWAGGER_BASIC_AUTH_PASSWORD) {
                    return next();
                }
                res.set('WWW-Authenticate', 'Basic realm="API Docs"');
                return res.status(401).send('Access denied');
            });
        }
        const config = new swagger_1.DocumentBuilder()
            .setTitle('CogniLingua API')
            .setDescription('API Gateway do CogniLingua')
            .setVersion('1.0')
            .addTag('Learning')
            .addTag('Curriculum')
            .addTag('Spanish')
            .addServer('/v1')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('docs', app, document, {
            swaggerOptions: { persistAuthorization: true },
        });
    }
    const port = process.env.API_GATEWAY_PORT || 3000;
    await app.listen(port);
    if (enableSwagger) {
        logger.log(`🚀 API Gateway ouvindo na porta ${port}`);
        logger.log(`📚 Swagger disponível em http://localhost:${port}/docs`);
    }
    else {
        logger.log(`🚀 API Gateway ouvindo na porta ${port}`);
        logger.log('📚 Swagger desabilitado (ENABLE_SWAGGER=false)');
    }
}
bootstrap();
//# sourceMappingURL=main.js.map