import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { GUARD_TYPE } from "../authentication.enum";

@Injectable()
export class JwtAuthenticationGuard extends AuthGuard(GUARD_TYPE.JWT){
    
}