import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';

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
}
