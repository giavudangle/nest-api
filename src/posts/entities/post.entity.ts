import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export interface IPost {
  id: number;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

@Entity({
  name: 'post',
})
export class Post implements IPost {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  public id: number;

  @ApiProperty()
  @Column()
  public title: string;

  @ApiProperty()
  @Column()
  public content: string;

  @ApiPropertyOptional()
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt?: string;

  @ApiPropertyOptional()
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt?: string;
}
