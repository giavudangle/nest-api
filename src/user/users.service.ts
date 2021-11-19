import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(Users) private userRepository : Repository<Users> ){
  }

  async getByEmail(email : string) : Promise<Users>{
    const user = await this.userRepository.findOne({email})
    if(user){
      return user;
    }
    return null;
  }

  async create(userData: CreateUserDto):Promise<Users>{
    const newUser = this.userRepository.create(userData);
    await this.userRepository.save(newUser);
    return newUser;
  }


 
}
