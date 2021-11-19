import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
  
} from '@nestjs/common';
import { Response } from 'express';
import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './dto/register-authentication.dto';
import { LocalAuthenticationGuard } from './guards/local-authentication.guard';
import IRequestWithUser from './interfaces/request-with-user.interface';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return this.authenticationService.register(registrationData);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  async login(@Req() request: IRequestWithUser, @Res() response : Response) {
    const {user} = request;
    const cookie = this.authenticationService.getCookieWithJwtToken(user.id);
    response.setHeader('Set-Cookie',cookie)
    user.password = undefined;
    return response.send(user);
  }
}
