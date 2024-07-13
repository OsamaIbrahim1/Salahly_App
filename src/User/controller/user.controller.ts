import { Body, Controller, Delete, Get, Headers, Patch, Post, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthGuard, RolesGuard, } from "../../Guards";
import { Request, Response, Express } from "express";
import { UserServices } from "../services";
import { HeadersDto, Role, Roles } from "../../utils";
import { FileInterceptor } from "@nestjs/platform-express";
import { multerImages } from "../../Guards/multer.guard";
import { updatePasswordSchema } from "../validation";
import { HeadersValidation, ZodValidationPipe } from "../../pipes";
import { updatePasswordBodyDTO } from "../../DTO";

@Controller('user')
export class UserController {
    constructor(
        private readonly userServices: UserServices
    ) {

    }

    @Get('profile')
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuard)
    @Roles(Role.USER, Role.TECHNICAL, Role.ADMIN)
    async userProfileController(
        @Req() req: Request,
        @Res() res: Response
    ) {
        const response = await this.userServices.getUserData(req)

        res.status(200).json({ message: 'User Data', data: response })
    }

    @Post('updateProfile')
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuard)
    @Roles(Role.USER, Role.TECHNICAL, Role.ADMIN)
    @UseInterceptors(FileInterceptor('image', multerImages))
    // @UsePipes(new ZodValidationPipe())
    async updateProfileController(
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const response = await this.userServices.updateProfileService(req)

        res.status(200).json({ message: 'User Data', data: response })
    }

    @Post('upload')
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuard)
    @Roles(Role.USER, Role.TECHNICAL, Role.ADMIN)
    @UseInterceptors(FileInterceptor('image', multerImages))
    async uploadFile(
        @Req() req: Request,
        @Res() res: Response,
        @UploadedFile() file: Express.Multer.File
    ) {
        const response = await this.userServices.uploadImage(req, file.path)

        return res.json({ mess: 'upload image successfully', response })
    }

    @Delete('deletProfile')
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuard)
    @Roles(Role.USER, Role.TECHNICAL, Role.ADMIN)
    async deleteProfileController(
        @Req() req: Request,
        @Res() res: Response
    ) {
        const response = await this.userServices.deleteProfileService(req)

        res.status(200).json({ message: 'User Data', data: response })
    }

    @Patch('updatePassword')
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuard)
    @Roles(Role.USER, Role.TECHNICAL, Role.ADMIN)
    @UsePipes(new ZodValidationPipe(updatePasswordSchema))
    async updatePasswordController(
        @HeadersValidation() headers: HeadersDto,
        @Req() req: Request,
        @Body() body: updatePasswordBodyDTO,
        @Res() res: Response
    ) {
        console.log("req:", headers)
        const response = await this.userServices.updatePasswordService(req, body)

        res.status(200).json({ message: 'update password successfully', data: response })
    }

    @Post('forgetPassword')
    async forgetPasswordController(
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const response = await this.userServices.forgetPasswordService(req)

        res.status(200).json({ message: 'sent code in your email', data: response })
    }

    @Post('resetPassword/:token')
    async resetPasswordController(
        @Req() req: Request,
        @Res() res: Response,
    ) {

        const response = await this.userServices.resetPasswordService(req)

        res.status(200).json({ message: 'sent code in your email', data: response })
    }
}
