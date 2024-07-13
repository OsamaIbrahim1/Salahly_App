import { Injectable } from '@nestjs/common';
import { IsEmail, IsNotEmpty, IsString, Length, Max, MaxLength, Min, MinLength, } from 'class-validator';

@Injectable()
export class signUpBodyDTO {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    @Length(11, 11)
    phoneNumber: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsString()
    @IsNotEmpty()
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