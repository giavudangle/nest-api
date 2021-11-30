import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt'
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) { }

  async getByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ email });
    if (user) {
      return user;
    }
    return null;
  }

  async getById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ id });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async create(userData: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(userData);
    await this.userRepository.save(newUser);
    return newUser;
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10)
    // Override the old refresh token to get the lastest refresh token
    await this.userRepository.update(userId, {
      currentHashedRefreshToken
    })
    return true;
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.getById(userId)

    const isRefreshTokenMatching = await bcrypt.compare(refreshToken, user.currentHashedRefreshToken)

    if (isRefreshTokenMatching) {
      return user;
    }

  }

  async removeRefreshToken(userId:number){
    return this.userRepository.update(userId,{
      currentHashedRefreshToken:null
    })
  }
}
