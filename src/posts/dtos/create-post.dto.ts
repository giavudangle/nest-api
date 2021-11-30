import { UploadedFile } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsAlphanumeric,
  IsArray,
  IsInstance,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Category } from '../../categories/entities/category.entity';

export class CreatePostDto {
  @ApiProperty()
  @MaxLength(50)
  @MinLength(5)
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(1000)
  content: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  image: any;

  @IsNotEmpty()
  @ApiProperty({
    type: () => Number,
    //isArray:true
  })
  categoriesIds: number[];
}
