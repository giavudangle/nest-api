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
  UploadedFile,
  HttpCode,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UpdatePostDto } from '../dtos/update-post.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiFoundResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Post as PostEntity } from '../entities/post.entity';
import { LoggingInterceptor } from '../../shared/interceptors/logging.interceptor';
import { JwtAccessTokenAuthenticationGuard } from '../../authentication/guards/jwt-access-token-authentication.guard';
import IRequestWithUser from '../../authentication/interfaces/request-with-user.interface';
import { PostNotFoundException } from '../exceptions/post-not-found.exception';
import { ExcludeNullInterceptor } from '../../shared/interceptors/exclude-null.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Path } from '../../shared/enums/path.enum';
import {
  editFileName,
  imageFileFilter,
} from '../../shared/utils/file-uploading.utils';

@ApiTags('Posts API')
//@UseInterceptors(ExcludeNullInterceptor)
@UseInterceptors(LoggingInterceptor)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAccessTokenAuthenticationGuard)
  @Post()
  @ApiCreatedResponse({
    type: PostEntity,
  })
  @HttpCode(201)
  @ApiCookieAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBadRequestResponse()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/assets/images',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createPostDto: CreatePostDto,
    @Req() req: IRequestWithUser,
  ): Promise<PostEntity> {
    const filePath = file.path.toString();

    const post = await this.postsService.create(
      createPostDto,
      req.user,
      filePath,
    );
    if (!post) {
      throw new BadRequestException();
    }
    return post;
  }

  @UseGuards(JwtAccessTokenAuthenticationGuard)
  @Get()
  @ApiOkResponse({
    type: PostEntity,
  })
  @ApiQuery({
    name: 'search',
    type: String,
    description: 'Search term',
    required: false,
  })
  @ApiNotFoundResponse()
  async findAll(@Query('search') search?: string): Promise<PostEntity[]> {
    if (search) {
      try {
        return await this.postsService.searchForPosts(search);
      } catch (e) {
        throw new NotFoundException();
      }
    } else {
      try {
        return await this.postsService.findAll();
      } catch (e) {
        throw new NotFoundException();
      }
    }
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

  @UseGuards(JwtAccessTokenAuthenticationGuard)
  @HttpCode(200)
  @ApiCookieAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBadRequestResponse()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/assets/images',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  @Patch(':id')
  @ApiOkResponse({
    type: PostEntity,
  })
  async update(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', ParseIntPipe) id: number,
    @Body() newPostInformation: UpdatePostDto,
  ): Promise<PostEntity> {
    const filePath = file.path.toString();
    const updatedPost = this.postsService.update(
      id,
      newPostInformation,
      filePath,
    );
    if (!updatedPost) {
      throw new BadRequestException();
    }
    return updatedPost;
  }

  @Delete(':id')
  @ApiBadRequestResponse()
  @ApiOkResponse()
  async remove(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    const flag = await this.postsService.remove(id);
    if (flag === false) {
      throw new BadRequestException();
    }
    return true;
  }
}
