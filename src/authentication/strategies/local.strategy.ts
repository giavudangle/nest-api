import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { AuthenticationService } from '../authentication.service';
import { Users } from '../../user/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authenticationService: AuthenticationService) {
    super({
      usernameField: 'email', //override base field of local strategy
    });
  }

  async validate(email: string, password: string): Promise<Users> {
    return this.authenticationService.getAuthenticateUser(email, password);
  }
}
