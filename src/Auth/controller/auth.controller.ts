import { Body, Controller, Get, Param, Post, Req, Res, UsePipes } from "@nestjs/common";
import { AuthService } from "../services/auth.services";
import { Request, Response } from "express";
import { ZodValidationPipe } from "../../pipes";
import { signInBodyDTO, signUpBodyDTO } from "../../DTO";
import { signInSchema, signUpSchema } from "../validation";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signUp')
    @UsePipes(new ZodValidationPipe(signUpSchema))
    async signUpController(
        @Body() body: signUpBodyDTO,
        @Req() req: any,
        @Res() res: Response
    ) {
        const response = await this.authService.signUpService(req, body)

        res.status(200).json({ message: 'User Created successfully.', data: response })
    }


    @Get('confirm-email/:token')
    async verifyEmailController(
        @Req() req: Request,
        @Res() res: Response
    ) {
        const response = await this.authService.verifyEmailService(req)

        res.status(200).json({ message: 'User verified successfully.', data: response })
    }

    @Post('signIn')
    @UsePipes(new ZodValidationPipe(signInSchema))
    async signInController(
        @Body() body: signInBodyDTO,
        @Res() res: Response
    ) {
        const response = await this.authService.SignInService(body)

        res.status(200).json({ message: 'User Created successfully.', data: response })
    }
}