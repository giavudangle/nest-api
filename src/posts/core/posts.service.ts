import {
  HttpCode,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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
    @Inject(PostsSearchService) private readonly postsSearchService : PostsSearchService,
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async create(
    postDto: CreatePostDto,
    author: User,
    imageUrl: string,
  ): Promise<Post> {
    const categoriesDto = JSON.parse(postDto.categories as any);
    const categoriesArray = [];

    // Reading in sequence
    for (const cate of categoriesDto) {
      const cat = this.categoriesRepository.create(cate);
      const savedCat = await this.categoriesRepository.save(cat);
      categoriesArray.push(savedCat);
    }

    // Reading in parallel
    // await Promise.all(categoriesDto.map(async cate => {
    //   const newCate = this.categoriesRepository.create(cate)
    //   const savedCate = await this.categoriesRepository.save(newCate)
    //   arr.push(savedCate)
    // }))

    const newPost = this.postsRepository.create({
      ...postDto,
      imageUrl,
      author,
      categories: categoriesArray,
    });
    await this.postsRepository.save(newPost);
    await this.postsSearchService.indexPost(newPost)

    return newPost;
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

  async update(id: number, post: UpdatePostDto,newImageUrl: string): Promise<Post> {
    //const test = await this.postsRepository.update(id, {...post,imageUrl:newImageUrl});
    console.log(Object.entries(post.categoriesIds as any))
    console.log({...post,imageUrl:newImageUrl})
    // const updatedPost = await this.postsRepository.findOne(id, {
    //   relations: ['author'],
    // });
    // if (updatedPost) {
    //   await this.postsSearchService.update(updatedPost)
    //   return updatedPost;
    // }


    return null;
  }

  async remove(id: number): Promise<boolean> {
    const deleteResponse = await this.postsRepository.delete(id);
    if (!deleteResponse.affected) {
      return false;
    }
    await this.postsSearchService.remove(id)
    return true;
  }

  async searchForPosts(text:string) : Promise<Post[]> {
    const results = await this.postsSearchService.search(text)
    const ids = results.map(r => r.id)
    if(!ids.length){
      return [];
    }
    return this.postsRepository.find({
      where:{
        id: In(ids)
      }
    })
  }

}
