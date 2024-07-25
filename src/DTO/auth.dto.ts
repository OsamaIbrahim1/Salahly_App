import { Injectable } from '@nestjs/common';
import { IsEmail, IsNotEmpty, IsString, Length, Matches, Max, MaxLength, Min, MinLength, } from 'class-validator';
import { emailRegex, passwordRegex, phoneRegex } from '../utils';

@Injectable()
export class signUpBodyDTO {
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

export class signInBodyDTO {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}