import { Module } from "@nestjs/common";
import { AuthService } from "src/Auth/services";
import { AuthController } from "../Auth/controller";
import { models } from "../DB/model-generation";
import { JwtService } from "@nestjs/jwt";

@Module({
    imports: [models],
    controllers: [AuthController],
    providers: [AuthService, JwtService],
})


export class AuthModule { }