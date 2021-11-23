import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
  @Expose()
  public id: number;

  @ApiProperty()
  @Column({ unique: true })
  @Expose()
  public email: string;

  @ApiProperty()
  @Column()
  @Expose()
  public name: string;

  @ApiProperty()
  @Exclude()
  @Column()
  public password: string;
}
