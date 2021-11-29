import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Category } from '../../categories/entities/category.entity';
import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @IsNumber()
  @IsOptional()
  id : number


  @ApiProperty()
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

  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  image: any;

  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    isArray:true
  })
  
  categoriesIds: Number
}
