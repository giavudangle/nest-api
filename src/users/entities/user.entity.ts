import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LocalFile } from '../../local-files/core/local-file.entity';
import { Post } from '../../posts/entities/post.entity';
import { Address } from './address.entity';

interface IUser {
  id: number;
  email: string;
  name: string;
  password: string;
}

@Entity('users')
export class User implements IUser {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  public id: number;

  @ApiProperty()
  @Column({ unique: true })
  public email: string;

  @ApiProperty()
  @Column()
  public name: string;

  @Column({nullable:true})
  @ApiPropertyOptional()
  public phoneNumber?: string;
  
  @JoinColumn({name:'avatar_id'})
  @OneToOne(
    () => LocalFile,
    {
      nullable:true
    }
  )
  public avatar?:LocalFile

  @Column({ nullable: true,name:'avatar_id' })
  public avatarId?: number;

  @ApiProperty()
  @Exclude()
  @Column()
  public password: string;

  @ApiProperty({ type: () => Address })
  @JoinColumn({
    name: 'address_id',
  })
  @OneToOne(() => Address, {
    eager: true,
    cascade: true,
  })
  public address?: Address;

  @ApiProperty({ type: () => Post })
  @OneToMany(() => Post, (post: Post) => post.author)
  public posts?: Post[];

  @Exclude()
  @Column({
    nullable:true
  })
  public currentHashedRefreshToken?:string
}
