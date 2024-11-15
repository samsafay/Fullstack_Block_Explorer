// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // TODO: error handling
  const app = await NestFactory.create(AppModule);
  // Enable CORS with default options
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('Block Explorer API')
    .setDescription('API for retrieving Ethereum block data')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3232);
}
bootstrap();
