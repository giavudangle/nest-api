import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { User } from '../../users/entities/user.entity';

export interface IPost {
  id: number;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
  category?: string;
  imageUrl: string;
}

@Entity({
  name: 'posts',
})
export class Post {
  @Index('post_id_index')
  @ApiProperty()
  @PrimaryGeneratedColumn()
  public id: number;

  @ApiProperty()
  @Column()
  public title: string;

  @ApiProperty()
  @Column()
  public content: string;

  @ApiProperty()
  @Column({
    name: 'image_url',
    nullable: true,
  })
  public imageUrl: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  @Index('post_authorId_index')
  @ManyToOne(() => User, (author: User) => author.posts)
  public author: User;

  @ApiProperty({
    type: () => Category,
  })
  @ManyToMany(() => Category, (category: Category) => category.posts, {
    cascade: true,
    eager: false,
    lazy: true,
  })
  @JoinTable({
    name: 'posts_to_categories',
    joinColumn: {
      name: 'post_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'category_id',
      referencedColumnName: 'id',
    },
  })
  @Transform(({ value }) => {
    if (value !== null) {
      return value;
    }
  })
  public categories: Category[];
}
