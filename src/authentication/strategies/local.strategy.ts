import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '../../user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { AuthenticationService } from '../core/authentication.service';


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authenticationService: AuthenticationService) {
    super({
      usernameField: 'email', //override base field of local strategy
    });
  }

  async validate(email: string, password: string): Promise<User> {
    return this.authenticationService.getAuthenticateUser(email, password);
  }
}
