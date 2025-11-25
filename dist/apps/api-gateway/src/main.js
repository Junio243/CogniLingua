"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = new swagger_1.DocumentBuilder()
        .setTitle('CogniLingua API')
        .setDescription('API Gateway do CogniLingua')
        .setVersion('1.0')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document);
    const port = process.env.API_GATEWAY_PORT || 3000;
    await app.listen(port);
    console.log(`🚀 API Gateway ouvindo na porta ${port}`);
    console.log(`📚 Swagger disponível em http://localhost:${port}/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map