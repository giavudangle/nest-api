import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { UserModule } from '../user/users.module';

import {PassportModule} from '@nestjs/passport'
import { LocalStrategy } from './local.strategy';

@Module({
  controllers: [AuthenticationController],
  providers: [AuthenticationService,LocalStrategy],
  imports:[UserModule,PassportModule]
})
export class AuthenticationModule {}
