import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app/app.module';
import { ExceptionsLoggerFilter } from './shared/filters/exceptions-logger.filter';

async function bootstrap() {
  // Nest Factory
  const app = await NestFactory.create(AppModule);

  const { httpAdapter } = app.get(HttpAdapterHost);

  // Apply middlewares, pipes, guards, interceptor
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({skipMissingProperties:true}));
  app.useGlobalFilters(new ExceptionsLoggerFilter(httpAdapter));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(
    app.get(Reflector)
  ))

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
