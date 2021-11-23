import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app/app.module';

async function bootstrap() {
  // Nest Factory
  const app = await NestFactory.create(AppModule);

  // Apply Global Guards
  //....

  // Apply middlewares,pipes,guards
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser())

  // Swagger Configs
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Nest-TypeORM Api Documentation')
    .setDescription('Simple api built with nest-typeorm-postgresql')
    .setVersion('1.0.0')
    .setBasePath('/api')
    .addCookieAuth('Authentication')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/', app, swaggerDocument);

  // Start App
  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
