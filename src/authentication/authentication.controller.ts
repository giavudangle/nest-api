import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
  
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { User } from '../user/entities/user.entity';
import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './dto/register-authentication.dto';
import { JwtAuthenticationGuard } from './guards/jwt-authentication.guard';
import { LocalAuthenticationGuard } from './guards/local-authentication.guard';
import IRequestWithUser from './interfaces/request-with-user.interface';

@ApiTags('Authentication API')
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
  async login(
    @Req() 
    request: IRequestWithUser, 
    @Res() response : Response) {

    const {user} = request;

    const cookie = this.authenticationService.getCookieWithJwtToken(user.id);
    response.setHeader('Set-Cookie',cookie)
    user.password = undefined;
    return response.send(user);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('logout')
  async logout(@Req() request: IRequestWithUser, @Res() response: Response){
    response.setHeader('Set-Cookie',this.authenticationService.getCookieForLogout());
    return response.sendStatus(200);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request : IRequestWithUser) : User{
    const user = request.user;
    user.password = undefined;
    return user;
  }
}
