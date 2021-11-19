import * as Joi from '@hapi/joi';
import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { PostsModule } from './posts/posts.module';
import { SeedingService } from './seeding/seeding.service';
import { UserModule } from './user/users.module';
import { AuthenticationModule } from './authentication/authentication.module';

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
    AuthenticationModule,
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
