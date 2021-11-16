import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { posts } from '../../data-seeding';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { IPost, Post } from './entities/post.entity';

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
    @InjectRepository(Post) private postsRepository: Repository<Post>,
  ) {}

  async seeding() {
    return posts.map(async (post : IPost) => {
      return await this.postsRepository.create(post);
    })
    // return posts.map(async (post : IPost) => {
    //   return await this.postsRepository
    //     .findOne({id: post.id})
    //     .then(async post => {
    //       if(post){
    //         return Promise.resolve(null);
    //       }
    //       return Promise.resolve(this.postsRepository.create(post))
    //     })
    //     .catch(e => Promise.reject(e))
    // })
  }

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const newPost = this.postsRepository.create(createPostDto);
    await this.postsRepository.save(newPost);
    return newPost;
  }

  async findAll(): Promise<Post[]> {
    return await this.postsRepository.find();
  }

  async findOne(id: number): Promise<Post> {
    return await this.postsRepository.findOne(id);
  }

  async update(id: number, post: UpdatePostDto): Promise<Post> {
    await this.postsRepository.update(id, post);
    const updatedPost = await this.postsRepository.findOne(id);
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
