import { Injectable } from '@nestjs/common';
import { IsEmail, IsNotEmpty, IsString, Length, Matches, Max, MaxLength, Min, MinLength, } from 'class-validator';
import { emailRegex, englishNameRegex, passwordRegex, phoneRegex } from 'src/utils';

@Injectable()
export class addAdminBodyDTO {
    @IsNotEmpty()
    @Matches(englishNameRegex, {
        message: 'name not valid'
    })
    @IsString()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    @Matches(emailRegex, {
        message: 'email is not valid'
    })
    email: string;

    @IsNotEmpty()
    @IsString()
    @Length(11, 11)
    @Matches(phoneRegex, {
        message: 'phone number is not valid'
    })
    phoneNumber: string;

    @IsNotEmpty()
    @IsString()
    @Matches(passwordRegex, {
        message: 'password is not valid'
    })
    password: string;

    @IsString()
    @IsNotEmpty()
    @Matches(passwordRegex, {
        message: 'confirm password is not valid'
    })
    confirmPassword: string
}

@Injectable()
export class updateAdminBodyDTO {
    @Matches(englishNameRegex, {
        message: 'name not valid'
    })
    @IsString()
    name: string;

    @IsEmail()
    @Matches(emailRegex, {
        message: 'email is not valid'
    })
    email: string;

    @IsString()
    @Length(11, 11)
    @Matches(phoneRegex, {
        message: 'phone number is not valid'
    })
    phoneNumber: string;

    @IsString()
    oldPublicId: string
}