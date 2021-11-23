import { ApiProperty } from '@nestjs/swagger';
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
  @IsAlphanumeric()
  @MaxLength(50)
  @MinLength(5)
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(1000)
  content: string;

  @IsArray()
  @ApiProperty({
    type: () => Category
  })
  categories : Category[]
  
}
