import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt,Strategy } from "passport-jwt";
import { UserService } from "../../users/users.service";
import ITokenPayload from "../interfaces/token-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        private readonly configService : ConfigService,
        private readonly usersService : UserService
    ){
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
                return request?.cookies?.Authentication;
            }]),
            secretOrKey: configService.get('JWT_SECRET')
        })
    }

    async validate(payload : ITokenPayload){
        return this.usersService.getById(payload.userId)
    }
}