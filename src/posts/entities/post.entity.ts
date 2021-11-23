import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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

  @ApiPropertyOptional()
  @Column({nullable:true})
  @Transform(({value}) => {
    if(value!==null){
      return value;
    }
  })
  category?:string


  @ManyToOne(() => User,(author:User) => author.posts)
  public author : User;
}
