import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app/app.module';
import { ExceptionsLoggerFilter } from './utils/exceptions-logger.filter';

async function bootstrap() {
  // Nest Factory
  const app = await NestFactory.create(AppModule);

  const { httpAdapter } = app.get(HttpAdapterHost);

  // Apply middlewares, pipes, guards
  app.useGlobalPipes(new ValidationPipe({skipMissingProperties:true}));
  app.use(cookieParser());
  app.useGlobalFilters(new ExceptionsLoggerFilter(httpAdapter));

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
