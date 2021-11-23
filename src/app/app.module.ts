import * as Joi from '@hapi/joi';
import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from '../authentication/core/authentication.module';
import { DatabaseModule } from '../database/database.module';
import { PostsModule } from '../posts/core/posts.module';
import { SeedingService } from '../seedings/seeding.service';
import { UserModule } from '../users/core/users.module';

@Module({
  imports: [
    // Database config module
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        // Postgresl Validation Schema
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
        // ==================================
        // JWT Validation Schema
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
    // Component modules
    PostsModule,
    DatabaseModule,
    UserModule,
    AuthenticationModule,
  ],
  // Controller
  controllers: [],
  // Providers injector
  providers: [SeedingService],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly seedingService: SeedingService) {}
  async onApplicationBootstrap() {
    //await this.seedingService.seed();
  }
}
