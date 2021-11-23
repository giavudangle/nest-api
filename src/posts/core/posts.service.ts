import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  ) {}

  async create(post: CreatePostDto,author : User): Promise<Post> {
    const newPost = await this.postsRepository.create({
      ...post,
      author
    });
    await this.postsRepository.save(newPost);
    return newPost;
  }

  async findAll(): Promise<Post[]> {
    return await this.postsRepository.find({
      relations:['author']
    });
  }

  async findOne(id: number): Promise<Post> {
    return await this.postsRepository.findOne(id,{
      relations:['author']
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
