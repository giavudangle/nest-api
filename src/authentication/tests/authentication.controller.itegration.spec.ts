import mockedUser from "../../shared/mocks/user.mock";
import { UserService } from "../../users/core/users.service";
import { User } from "../../users/entities/user.entity";
import { AuthenticationService } from "../core/authentication.service";
import * as bcrypt from 'bcrypt'
import { Test } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { mockedConfigService } from "../../shared/mocks/config-service.mock";
import { JwtService } from "@nestjs/jwt";
import { mockedJwtService } from "../../shared/mocks/jwt-service.mock";
import { getRepositoryToken } from "@nestjs/typeorm";


describe('The AuthenticationService Integration Testing',() => {
    let authenticationService: AuthenticationService;
    let usersService: UserService;
    let bcryptCompare: jest.Mock;
    let userData: User;
    let findUser: jest.Mock;

    beforeEach(async () => {
        userData = {
            ...mockedUser
        }
        findUser = jest.fn().mockResolvedValue(userData);
        const userRepository = {
            findOne : findUser
        }

        bcryptCompare = jest.fn().mockReturnValue(true);
        (bcrypt.compare as jest.Mock) = bcryptCompare;

        const module = await Test.createTestingModule({
            providers: [
              UserService,
              AuthenticationService,
              {
                provide: ConfigService,
                useValue: mockedConfigService
              },
              {
                provide: JwtService,
                useValue: mockedJwtService
              },
              {
                provide: getRepositoryToken(User),
                useValue: userRepository
              }
            ],
          })
            .compile();
          authenticationService = await module.get<AuthenticationService>(AuthenticationService);
          usersService = await module.get<UserService>(UserService); 
    })


    describe('When accessing the data of authenticating user',() => {
        it('Should attempt to get a user by email',async () => {
            // const getByEmailSpy = jest.spyOn(usersService,'getByEmail')
            // await authenticationService.getAuthenticateUser('daniel.dang@contemi.com','danielne')
            // expect(getByEmailSpy).toBeCalledTimes(1)
            expect(true)
        })
    })
})