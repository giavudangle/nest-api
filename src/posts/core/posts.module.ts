import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../entities/post.entity';
import { CategoriesService } from '../../categories/core/categories.service';
import { CategoriesModule } from '../../categories/core/categories.module';
import { Category } from '../../categories/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Category])],
  controllers: [PostsController],
  providers: [PostsService, CategoriesService],
})
export class PostsModule {}
