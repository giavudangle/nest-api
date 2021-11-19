import { Body, Controller,HttpCode,Post, Req, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './dto/register-authentication.dto';
import { LocalAuthenticationGuard } from './local-authentication.guard';
import RequestWithUser from './request-with-user';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  async register(@Body() registrationData: RegisterDto){
    return this.authenticationService.register(registrationData)
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  async login(@Req() request: RequestWithUser){
    const user = request.user;
    user.password = undefined;
    return user;
  }
}
