import {
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, Transaction } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { User } from '../../users/entities/user.entity';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UpdatePostDto } from '../dtos/update-post.dto';

import { Post } from '../entities/post.entity';
import { PostsSearchService } from '../../search/services/post-search.service';

@Injectable()
export class PostsService {
  /**
   * Create an instance of class.
   *
   * @constructs
   *
   * @param {Repository<Post>} postsRepository
   */
  constructor(
    @Inject(PostsSearchService)
    private readonly postsSearchService: PostsSearchService,
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async create(
    postDto: CreatePostDto,
    author: User,
    imageUrl: string,
  ): Promise<Post> {
    //#region Cached
    // Reading in sequence
    // for (const cate of categoriesDto) {
    //   const cat = this.categoriesRepository.create(cate);
    //   const savedCat = await this.categoriesRepository.save(cat);
    //   categoriesArray.push(savedCat);
    // }

    // Reading in parallel
    // await Promise.all(categoriesDto.map(async cate => {
    //   const newCate = this.categoriesRepository.create(cate)
    //   const savedCate = await this.categoriesRepository.save(newCate)
    //   arr.push(savedCate)
    // }))
    //#endregion
    const cateIds = JSON.parse(postDto.categories as any).map(
      (item : Category) => item.id
    )

    try {
      const fetchCates = await this.categoriesRepository.findByIds(cateIds)
      const newPost = this.postsRepository.create({
        ...postDto,
        imageUrl,
        author,
        categories: fetchCates,
      })
      await this.postsRepository.save(newPost);
      await this.postsSearchService.indexPost(newPost);
      return newPost;
      ;
    }catch(e){
      throw new HttpException('Soemthing went wrong', HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(): Promise<Post[]> {
    return await this.postsRepository.find({
      relations: ['author', 'categories'],
    });
  }

  async findOne(id: number): Promise<Post> {
    return await this.postsRepository.findOne(id, {
      relations: ['author', 'categories'],
    });
  }

  async update(
    id: number,
    post: UpdatePostDto,
    imageUrl: string,
  ): Promise<Post> {
    const cateIds = JSON.parse(post.categories as any).map(
      (item: Category) => item.id,
    );
    try {
      const cates = await this.categoriesRepository.findByIds(cateIds);
      const updatePost = await this.postsRepository.findOne(id);
      updatePost.title = post.title;
      updatePost.content = post.content;
      updatePost.imageUrl = imageUrl;
      updatePost.categories = cates;
      await this.postsRepository.save(updatePost);
      const updatedPost = await this.postsRepository.findOne(id, {
        relations: ['categories', 'author'],
      });
      await this.postsSearchService.update(updatedPost);
      return updatedPost;
    } catch (e) {
      throw new HttpException('Soemthing went wrong', HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number): Promise<boolean> {
    const deleteResponse = await this.postsRepository.delete(id);
    if (!deleteResponse.affected) {
      return false;
    }
    await this.postsSearchService.remove(id);
    return true;
  }

  async searchForPosts(text: string): Promise<Post[]> {
    const results = await this.postsSearchService.search(text);
    const ids = results.map((r) => r.id);
    if (!ids.length) {
      return [];
    }
    return this.postsRepository.find({
      where: {
        id: In(ids),
      },
    });
  }
}
