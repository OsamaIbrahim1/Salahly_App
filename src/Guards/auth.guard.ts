import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Observable } from 'rxjs';
import { User } from '../DB/Schemas';
import { JwtService } from '@nestjs/jwt';
import * as env from '../config/app.environments';
import { Model } from 'mongoose';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private jwtService: JwtService
    ) { }

    async canActivate(
        context: ExecutionContext,
    ): Promise<object> {

        const req = context.switchToHttp().getRequest();
        const { accesstoken } = req.headers;
        if (!accesstoken) {
            throw new BadRequestException(`please login first`)
        }
        if (!accesstoken.startsWith(env.PREFIX_LOGIN_TOKEN)) {
            throw new BadRequestException(`invalid token prefix`);
        }

        const token = accesstoken.split(env.PREFIX_LOGIN_TOKEN)[1];

        const decodedData = this.jwtService.verify(token, { secret: env.SECRET_LOGIN_TOKEN });
        if (!decodedData._id) {
            throw new BadRequestException(`invalid token payload`);
        }

        // check user
        const findUser = await this.userModel.findById(
            decodedData._id,
            "name email role"
        );
        if (!findUser) { throw new BadRequestException(`please SignUp first`); }

        // * TokenExpiredError: jwt expired

        req.authUser = findUser

        return req

    }
}