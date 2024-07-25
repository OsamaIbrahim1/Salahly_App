import { Body, Controller, Delete, Get, Post, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request, Response } from "express";
import { AdminServices } from "../services";
import { AuthGuardAdmin, multerImages, RolesGuard } from "../../Guards";
import { addAdminBodyDTO, signInBodyDTO, updateAdminBodyDTO } from "../../DTO";
import { Role, Roles } from "../../utils";

@Controller('admin')

export class AdminController {
    constructor(
        private readonly adminServices: AdminServices
    ) { }

    //=============================== add Admin ===============================//
    @Post('addAdmin')
    @UseInterceptors(FileInterceptor('image', multerImages))
    async addAdminController(
        @Req() req: Request,
        @Body() body: addAdminBodyDTO,
        @Res() res: Response,
        @UploadedFile() file: Express.Multer.File
    ) {

        const response = await this.adminServices.addAdmin(req, body, file)

        res.status(200).json({ message: 'Admin Added success', data: response })
    }

    //================================= verify Admin Account ===============================//
    @Get('confirm-email/:token')
    async verrifyAdminAccountController(
        @Req() req: Request,
        @Res() res: Response
    ) {
        const response = await this.adminServices.verifyAdminAccountServices(req)

        res.status(200).json({ message: 'Admin Verified successfully.', data: response })
    }

    //================================= Login Admin ===============================//
    @Post('loginAdmin')
    async loginAdminController(
        @Body() body: signInBodyDTO,
        @Res() res: Response,
    ) {
        const response = await this.adminServices.loginAdminServices(body)

        res.status(200).json({ message: 'Admin Logged in successfully.', data: response })
    }

    //================================= get data Admin ===============================//
    @Get('getAdmin')
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuardAdmin)
    @Roles(Role.ADMIN)
    async getAdminDataController(
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const response = await this.adminServices.getAdminDataServices(req)

        res.status(200).json({ message: 'get Admin data successfully.', data: response })
    }

    //================================= update Admin ===============================//
    @Put('updateAdmin')
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuardAdmin)
    @Roles(Role.ADMIN)
    @UseInterceptors(FileInterceptor('image', multerImages))
    async updateAdminController(
        @Req() req: Request,
        @Body() body: updateAdminBodyDTO,
        @Res() res: Response,
    ) {
        const response = await this.adminServices.updateAdminServices(req, body)

        res.status(200).json({ message: 'Admin Updated successfully.', data: response })
    }

    //============================= delete Admin ===============================//
    @Delete('deleteAdmin')
    @UseGuards(RolesGuard)
    @UseGuards(AuthGuardAdmin)
    @Roles(Role.ADMIN)
    async deleteAdminController(
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const response = await this.adminServices.deleteAdminServices(req)

        res.status(200).json({ message: 'Admin Deleted successfully.', data: response })
    }
}