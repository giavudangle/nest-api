import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from '../../posts/entities/post.entity';
@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  public id?: number;

  @ApiProperty()
  @Column({
    //unique:true,
    nullable: true,
  })
  public name: string;

  @ApiProperty()
  @Column({
    //unique:true,
    nullable: true,
  })
  public code: string;

  @ManyToMany(() => Post, (post: Post) => post.categories,{cascade:true})
  public posts: Post[];
}
