import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt'
import { UserService } from '../user/users.service';
import { RegisterDto } from './dto/register-authentication.dto';

@Injectable()
export class AuthenticationService {
	constructor(private readonly usersService: UserService) { }

	public async register(registrationData: RegisterDto) {
		const hashedPassword = await bcrypt.hash(registrationData.password, 10);
		try {
			const createdUser = await this.usersService.create(
				{ ...registrationData, password: hashedPassword })
			createdUser.password = undefined;
			return createdUser;
		} catch (error) {
			if (error?.code === POSTGRE_ERROR_CODE.UniqueViolation) {
				throw new HttpException('User with that email already exists', HttpStatus.BAD_REQUEST)
			} else {
				throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR)
			}
		}
	}

	public async getAuthenticateUser(email: string, hashedPassword: string) {
		try {

		} catch (error) {

		}
	}



}
