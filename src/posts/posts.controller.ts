import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiFoundResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Post as PostEntity } from './entities/post.entity';

@ApiTags('Posts API')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiCreatedResponse({
    type: PostEntity,
  })
  @ApiBadRequestResponse()
  async create(@Body() createPostDto: CreatePostDto): Promise<PostEntity> {
    const post = await this.postsService.create(createPostDto);
    if (!post) {
      throw new BadRequestException();
    }
    return post;
  }

  @Get('/seeding')
  async seeding(){
    const list = await this.postsService.seeding();
    return list;
  }

  @Get()
  @ApiOkResponse({
    type: PostEntity,
  })
  @ApiNotFoundResponse()
  async findAll(): Promise<PostEntity[]> {
    const posts = await this.postsService.findAll();
    if (!posts) {
      throw new NotFoundException();
    }
    return posts;
  }

  @Get(':id')
  @ApiOkResponse({
    type: PostEntity,
  })
  @ApiNotFoundResponse()
  @ApiFoundResponse()
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const post = await this.postsService.findOne(id);
    if (!post) {
      throw new NotFoundException();
    }
    return post;
  }

  @Patch(':id')
  @ApiOkResponse({
    type: PostEntity,
  })
  @ApiBadRequestResponse()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() newPostInformation: UpdatePostDto,
  ): Promise<PostEntity> {
    const updatedPost = this.postsService.update(id, newPostInformation);
    if (!updatedPost) {
      throw new BadRequestException();
    }
    return updatedPost;
  }

  @Delete(':id')
  @ApiForbiddenResponse()
  @ApiOkResponse()
  async remove(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    const flag = await this.postsService.remove(id);
    if (flag == null) {
      throw new ForbiddenException();
    }
    return true;
  }
}
