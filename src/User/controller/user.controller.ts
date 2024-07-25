import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors, UsePipes } from "@nestjs/common";
import { AuthGuard, RolesGuard, } from "../../Guards";
import { Request, Response, Express } from "express";
import { UserServices } from "../services";
import { Role, Roles } from "../../utils";
import { FileFieldsInterceptor, FileInterceptor } from "@nestjs/platform-express";
import { multerImages } from "../../Guards/multer.guard";
import { updatePasswordSchema } from "../validation";
import { ZodValidationPipe } from "../../pipes";
import { acceptORRejectParamsDTO, acceptORRejectQueryDTO, convertToTechnicalBodyDTO, forgetPasswordDto, resetPasswordBodyDTO, resetPasswordTokenDto, updatePasswordBodyDTO } from "../../DTO";

@Controller('user')
export class UserController {
    constructor(
        private readonly userServices: UserServices
    ) {

    }

    @Get('profile')
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuard)
    @Roles(Role.USER, Role.TECHNICAL)
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
    @Roles(Role.USER)
    @UseInterceptors(FileInterceptor('image', multerImages))
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
    @Roles(Role.USER, Role.TECHNICAL)
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
    @Roles(Role.USER, Role.TECHNICAL)
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
    @Roles(Role.USER, Role.TECHNICAL)
    @UsePipes(new ZodValidationPipe(updatePasswordSchema))
    async updatePasswordController(
        @Req() req: Request,
        @Body() body: updatePasswordBodyDTO,
        @Res() res: Response
    ) {
        const response = await this.userServices.updatePasswordService(req, body)

        res.status(200).json({ message: 'update password successfully', data: response })
    }

    @Post('forgetPassword')
    async forgetPasswordController(
        @Body() body: forgetPasswordDto,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const response = await this.userServices.forgetPasswordService(req, body)

        res.status(200).json({ message: 'sent code in your email', data: response })
    }

    @Post('resetPassword/:token')
    async resetPasswordController(
        @Param() param: resetPasswordTokenDto,
        @Body() body: resetPasswordBodyDTO,
        @Res() res: Response,
    ) {

        const response = await this.userServices.resetPasswordService(param, body)

        res.status(200).json({ message: 'reset password successfully', data: response })
    }

    @Post('convertToTechnical')
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuard)
    @Roles(Role.USER)
    @UseInterceptors(FileFieldsInterceptor([{ name: 'frontImageNationalId', maxCount: 1 }, { name: 'backImageNationalId', maxCount: 1 }], multerImages))
    async convertToTechnicalController(
        @Body() body: convertToTechnicalBodyDTO,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const response = await this.userServices.convertToTechnicalService(req, body)

        res.status(200).json({ message: 'Your request will be discussed', data: response })
    }

    @Post('acceptORReject/:requestId')
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN)
    async acceptORRejectController(
        @Param() params: acceptORRejectParamsDTO,
        @Query() query: acceptORRejectQueryDTO,
        @Res() res: Response
    ) {
        const response = await this.userServices.acceptORRejectService(params, query)

        res.status(200).json({ message: 'response successfully.', data: response })
    }
}
