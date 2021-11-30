import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../entities/post.entity';
import { CategoriesService } from '../../categories/core/categories.service';
import { CategoriesModule } from '../../categories/core/categories.module';
import { Category } from '../../categories/entities/category.entity';
import { PostsSearchService } from '../../search/services/post-search.service';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { SearchModule } from '../../search/core/search.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Category]), SearchModule],
  controllers: [PostsController],
  providers: [PostsService, CategoriesService, PostsSearchService],
})
export class PostsModule {}
