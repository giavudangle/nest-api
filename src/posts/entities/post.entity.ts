import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { User } from '../../users/entities/user.entity';

export interface IPost {
  id: number;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
  category? : string
}

@Entity({
  name: 'posts',
})
export class Post {
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

  @ManyToOne(() => User,(author:User) => author.posts)
  public author : User;

  @ApiProperty({
    type: () => Category
  })
  @ManyToMany(() => Category,(category: Category) => category.posts)
  @JoinTable({
    name:'posts_to_categories'
  })
  @Transform(({value}) => {
    if(value!==null){
      return value;
    }
  })
  public categories : Category[];


}
