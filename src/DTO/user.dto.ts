import { Injectable } from "@nestjs/common";
import { IsNotEmpty, IsOptional, IsString, Length, Matches } from "class-validator";
import { passwordRegex } from "../utils";

@Injectable()
export class updatePasswordBodyDTO {
    @IsNotEmpty()
    @IsString()
    @IsString()
    @Matches(passwordRegex, {
        message: "*Invalid old password"
    })
    oldPassword: string;

    @IsNotEmpty()
    @IsString()
    @Matches(passwordRegex, {
        message: "*Invalid new password"
    })
    newPassword: string
}
