import { HttpCode, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { User } from '../../users/entities/user.entity';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UpdatePostDto } from '../dtos/update-post.dto';

import { Post } from '../entities/post.entity';


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
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
    @InjectRepository(Category) private readonly categoriesRepository: Repository<Category>

  ) {}
  


  async create(postDto: CreatePostDto,author : User,imageUrl : string): Promise<Post> {
    const categoriesDto = JSON.parse(postDto.categories as any)
    let categoriesArray = [] ;

    // Reading in sequence
    for(const cate of categoriesDto){
      let cat = this.categoriesRepository.create(cate)
      let savedCat = await this.categoriesRepository.save(cat) 
      categoriesArray.push(savedCat)
    }

    // Reading in parallel
    // await Promise.all(categoriesDto.map(async cate => {
    //   const newCate = this.categoriesRepository.create(cate)
    //   const savedCate = await this.categoriesRepository.save(newCate)
    //   arr.push(savedCate)
    // }))
  

    
    let newPost =  this.postsRepository.create({
      ...postDto,
      imageUrl,
      author,
      categories:categoriesArray
    });

    return await this.postsRepository.save(newPost);
  }

  async findAll(): Promise<Post[]> {
    return await this.postsRepository.find({
      relations:['author','categories']
    });
  }

  async findOne(id: number): Promise<Post> {
    return await this.postsRepository.findOne(id,{
      relations:['author','categories']
    });
  }

  async update(id: number, post: UpdatePostDto): Promise<Post> {
    await this.postsRepository.update(id, post);
    const updatedPost = await this.postsRepository.findOne(id,{
      relations:['author']
    });
    if (updatedPost) {
      return updatedPost;
    }
    return null;
  }

  async remove(id: number): Promise<boolean> {
    const deleteResponse = await this.postsRepository.delete(id);
    if (!deleteResponse.affected) {
      return false;
    }
    return true;
  }
}
