import { Module } from "@nestjs/common";
import { UserController } from "../User/controller";
import { UserServices } from "src/User/services";
import { models } from "../DB/model-generation";
import { JwtService } from "@nestjs/jwt";
import { MulterModule } from "@nestjs/platform-express";

@Module({
    imports: [
        models,
        MulterModule.register({
            dest: './uploads',
        })
    ],
    controllers: [UserController],
    providers: [UserServices, JwtService],
    exports: [],
})
export class UserModule { }