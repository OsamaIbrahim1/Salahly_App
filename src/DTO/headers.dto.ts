import { Injectable } from "@nestjs/common";
import { Contains, IsNotEmpty, IsString } from "class-validator";
import * as env from '../config'

@Injectable()
export class HeadersDto {
    @IsString()
    @IsNotEmpty()
    @Contains(env.PREFIX_LOGIN_TOKEN)
    accesstoken: string;
    
    @IsNotEmpty()
    @IsString()
    "postman-token": string;

    @IsNotEmpty()
    @IsString()
    "cache-control": string;

    @IsNotEmpty()
    @IsString()
    host: string;

    @IsNotEmpty()
    @IsString()
    "content-type": string;

    @IsNotEmpty()
    @IsString()
    "content-length": string;

    @IsNotEmpty()
    @IsString()
    "user-agent": string;

    @IsNotEmpty()
    @IsString()
    accept: string;

    @IsNotEmpty()
    @IsString()
    "accept-encoding": string;

    @IsNotEmpty()
    @IsString()
    connection: string;
}