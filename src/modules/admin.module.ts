import { Module } from "@nestjs/common";
import { AuthService } from "src/Auth/services";
import { AuthController } from "../Auth/controller";
import { models } from "../DB/model-generation";
import { JwtService } from "@nestjs/jwt";
import { AdminServices } from "../Admin/services";
import { AdminController } from "../Admin/controller";
import { SendEmailService } from "../common/services";

@Module({
    imports: [models],
    controllers: [AdminController],
    providers: [AdminServices, JwtService, SendEmailService],
})


export class AdminModule { }