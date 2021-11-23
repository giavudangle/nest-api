import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @ApiProperty()
  @IsAlphanumeric()
  @MaxLength(50)
  @MinLength(5)
  @IsNotEmpty()
  @ApiPropertyOptional()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @ApiPropertyOptional()
  @MaxLength(1000)
  content: string;
}
