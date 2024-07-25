import { Injectable } from "@nestjs/common";
import { IsDate, IsDateString, IsEmail, IsMongoId, IsNotEmpty, IsString, Length, Matches, MaxDate, MinDate } from "class-validator";
import { arabicNameRegex, englishNameRegex, passwordRegex } from "../utils";

@Injectable()
export class updatePasswordBodyDTO {
    @IsNotEmpty()
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

export class forgetPasswordDto {
    @IsNotEmpty()
    @IsEmail()
    email: string
}

export class resetPasswordTokenDto {
    @IsNotEmpty()
    @IsString()
    token: string
}

export class resetPasswordBodyDTO {
    @IsNotEmpty()
    @IsString()
    @Matches(passwordRegex, {
        message: "*Invalid old password"
    })
    password: string
}

//====================================== convert To Technical Body DTO =======================================//
export class convertToTechnicalBodyDTO {
    @IsNotEmpty()
    @IsString()
    @Matches(arabicNameRegex, {
        message: "*Invalid arabic name, must be 10 to 30 characters and must be in arabic letters"
    })
    @Length(10, 30)
    arabicName: string;

    @IsNotEmpty()
    @IsString()
    @Matches(englishNameRegex, {
        message: "*Invalid english name, must be 10 to 30 characters and must be in english letters"
    })
    @Length(10, 30)
    englishName: string;

    @IsNotEmpty()
    @IsDateString()
    birthDate: Date;

    @IsNotEmpty()
    @IsString()
    @Length(3, 30)
    hisSkill: string
}

//==================================== accept OR Reject Params DTO =======================================//
export class acceptORRejectParamsDTO {
    @IsNotEmpty()
    @IsMongoId()
    requestId: object
}
//==================================== accept OR Reject Query DTO =======================================//
export class acceptORRejectQueryDTO {
    @IsNotEmpty()
    @IsString()
    @Matches(/(accept|reject)/)
    status: string
}