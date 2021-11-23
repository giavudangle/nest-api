import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn()
  public id: number;

  @ApiPropertyOptional()
  @Column()
  public street: string;

  @ApiPropertyOptional()
  @Column()
  public city: string;

  @ApiPropertyOptional()
  @Column()
  public country: string;

  @OneToOne(() => User,(user:User) => user.address)
  public user:User
}
