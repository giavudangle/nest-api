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
  UseGuards,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UpdatePostDto } from '../dtos/update-post.dto';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiFoundResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Post as PostEntity } from '../entities/post.entity';
import { LoggingInterceptor } from '../../shared/interceptors/logging.interceptor';
import { JwtAuthenticationGuard } from '../../authentication/guards/jwt-authentication.guard';
import IRequestWithUser from '../../authentication/interfaces/request-with-user.interface';
import { PostNotFoundException } from '../exceptions/post-not-found.exception';
import { ExcludeNullInterceptor } from '../../shared/interceptors/exclude-null.interceptor';


@ApiTags('Posts API')
@UseInterceptors(ExcludeNullInterceptor)
@UseInterceptors(LoggingInterceptor)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthenticationGuard)
  @Post()
  @ApiCreatedResponse({
    type: PostEntity,
  })
  @ApiCookieAuth()
  @ApiBadRequestResponse()
  async create(@Body() createPostDto: CreatePostDto,@Req() req : IRequestWithUser): Promise<PostEntity> {
    const post = await this.postsService.create(createPostDto,req.user)
    if (!post) {
      throw new BadRequestException();
    }
    return post;
  }

  @UseGuards(JwtAuthenticationGuard)
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
      throw new PostNotFoundException(id);
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
