import * as Joi from '@hapi/joi';
import { Inject, Injectable, Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './database/database.module';
import { Post } from './posts/entities/post.entity';
import { PostsModule } from './posts/posts.module';
import { SeedingService } from './seeding/seeding.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    // Database config module
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
      }),
    }),
    // Component modules
    PostsModule,
    DatabaseModule,
    UserModule,
  ],
  // Controller
  controllers: [],
  // Providers injector
  providers: [SeedingService],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly seedingService : SeedingService){

  }
  async onApplicationBootstrap() {
    await this.seedingService.seed();
  }

}
