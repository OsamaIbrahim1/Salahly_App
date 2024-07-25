import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { JwtService } from '@nestjs/jwt'
import { Model } from "mongoose";
import * as bcrypt from 'bcrypt'
import { Request } from "express";
import { v2 as cloudinary } from "cloudinary";
import { CodeForgetPassword, User, Pending } from "../../DB/Schemas";
import * as env from '../../config'
import UniqueString from '../../utils/generate-Unique-String'
import { SendEmailService } from "../../common/services";
import { convertToTechnicalBodyDTO, forgetPasswordDto, resetPasswordBodyDTO, resetPasswordTokenDto, updatePasswordBodyDTO } from "../../DTO";
import { Role, StatusPendingRequest } from "../../utils";

@Injectable()
export class UserServices {
    constructor(
        @InjectModel(User.name) private User: Model<User>,
        @InjectModel(CodeForgetPassword.name) private CodeForgetPassword: Model<CodeForgetPassword>,
        @InjectModel(Pending.name) private Pending: Model<Pending>,
        private jwtService: JwtService,
        private sendEmailService: SendEmailService

    ) {
        cloudinary.config({
            cloud_name: env.CLOUD_NAME,
            api_key: env.API_KEY,
            api_secret: env.API_SECRET,
        });
    }

    //=============================== update Profile ===============================//
    /**
     * @param req { _id, oldPublicId, phoneNumber }
     * * check user
     * * check if user want to change image
     * * check if user want to change phone number
     * * save changes
     * @returns { user }
     */
    async updateProfileService(req: any): Promise<User> {
        const { _id } = req.authUser
        const { oldPublicId, phoneNumber } = req.body

        // * check user
        const user = await this.User.findById(_id)
        if (!user) {
            throw new BadRequestException('User not found')
        }

        // * check if user want to change image
        if (oldPublicId) {
            if (!req.file.path) {
                throw new BadRequestException('Please upload image')
            }

            const newPublicId = oldPublicId.split(`${user.folderId}/`)[1];

            // * update image and use same public id  and folder id
            const { secure_url, public_id } =
                await cloudinary.uploader.upload(req.file.path, {
                    folder: `${env.MAIN_FOLDER}/users/${user.folderId}`,
                    public_id: newPublicId,
                });
            user.Image.secure_url = secure_url;
        }

        // * check if user want to change phone number
        if (phoneNumber) {
            if (phoneNumber === user.phoneNumber) {
                throw new BadRequestException('Phone number already match with old phoneNumber, please try another one')
            }

            const isPhoneNumberExist = await this.User.findOne({ phoneNumber: phoneNumber })
            if (isPhoneNumberExist) {
                throw new BadRequestException('Phone number already exist, please try another one')
            }
            user.phoneNumber = phoneNumber
        }

        // * save changes
        user.save()

        return user
    }

    //=============================== delete Profile ===============================//
    /**
     * @param req { _id }
     * * check user and delete user
     * * delete image and folder of user
     * @returns { user }
     */
    async deleteProfileService(req: any): Promise<User> {
        const { _id } = req.authUser
        // * check user
        const user = await this.User.findByIdAndDelete(_id)
        if (!user) {
            throw new BadRequestException('User not deleted')
        }

        // * delete image and folder of user
        await cloudinary.api.delete_resources_by_prefix(
            `${env.MAIN_FOLDER}/users/${user.folderId}`
        );
        await cloudinary.api.delete_folder(
            `${env.MAIN_FOLDER}/users/${user.folderId}`
        );

        return user
    }

    //=============================== upload Image ===============================//
    /**
     * @param req { _id }
     * @param filePath 
     * * check user
     * * check if user not uploade image
     * * create folder Id
     * * upload image
     * * save changes
     * @returns { user }
     */
    async uploadImage(req: any, filePath: string): Promise<User> {
        // * destructure data from authUser
        const { _id } = req.authUser;

        // * check user
        const user = await this.User.findById(_id);
        if (!user) {
            throw new BadRequestException("user not found");
        }

        // * check if user not uploade image
        if (!filePath) {
            throw new BadRequestException("enter one Image please.");
        }

        // * create folder Id
        const folderId = UniqueString.generateUniqueString(5);

        // * upload image
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `${env.MAIN_FOLDER}/users/${folderId}`,
        });
        user.Image = { secure_url, public_id };
        user.folderId = folderId;

        // * save changes
        await user.save();

        return user
    }

    //=============================== get user data ===============================//
    /**
     * @param req { _id }
     * * check user
     * @returns { user }
     */
    async getUserData(req: any): Promise<User> {
        const { _id } = req.authUser

        // * check user
        const user = await this.User.findById(_id, 'email phoneNumber role Image.secure_url -_id')
        if (!user) {
            throw new BadRequestException('User not found')
        }

        return user
    }

    //=============================== update password ===============================//
    /**
     * @param req{ _id, oldPassword, newPassword } 
     * * check user
     * * compare old password with user password
     * * compare old password with new password
     * * hash new password
     * * update password and save changes
     * @returns { user }
     */
    async updatePasswordService(req: any, body: updatePasswordBodyDTO): Promise<User> {
        const { _id } = req.authUser
        const { oldPassword, newPassword } = req.body

        // * check user
        const user = await this.User.findById(_id)
        if (!user) {
            throw new BadRequestException('User not found')
        }

        // * compare old password with user password
        const checkPassword = bcrypt.compareSync(oldPassword, user.password)
        if (!checkPassword) {
            throw new BadRequestException('Old password is incorrect')
        }

        // * compare old password with new password
        if (oldPassword === newPassword) {
            throw new BadRequestException('Old password and new password should not be same')
        }
        // * hash new password
        const hashNewPassword = bcrypt.hashSync(newPassword, env.SALT_ROUNDS)
        if (!hashNewPassword) {
            throw new BadRequestException('New password not hashed')
        }

        // * update password and save changes
        user.password = hashNewPassword
        user.save()

        // * return user
        return user
    }

    //=============================== forget password ===============================//
    /**
     * * destructure data from body
     * * check if email is exist
     * * generate code to reset password
     * * hash code
     * * generate token to reset password
     * * send email
     * * save code to reset password
     */
    async forgetPasswordService(req: Request, body: forgetPasswordDto) {
        // * destructure data from body
        const { email } = body

        // * check if email is exist
        const user = await this.User.findOne({ email })
        if (!user) {
            throw new BadRequestException('User not found')
        }

        // * generate code to reset password
        const forgetCode = UniqueString.generateUniqueCodeForForgetPassword(5)

        // * hash code
        const hash = bcrypt.hashSync(forgetCode, env.SALT_ROUNDS_FOR_CODE_RESET_PASSWORD)
        if (!hash) {
            throw new BadRequestException('Code not hashed')
        }

        // * generate token to reset password
        const token = this.jwtService.sign({ _id: user._id, email, forgetCode: hash }, { secret: env.RESET_TOKEN, expiresIn: env.TIME_EXPIRE_TOKEN_FOR_RESET_PASSWORD })

        const confirmationLink = `${req.protocol}://${req.headers.host}/user/resetPassword/${token}`

        // * send email
        const isEmailSent = await this.sendEmailService.sendEmail(email,
            'welcome to our app', `<h1>Click on the link to reset password</h1>
            <a href="${confirmationLink}">Reset Password</a>`)
        if (!isEmailSent) {
            throw new BadRequestException('Email is not sent')
        }

        // * save code to reset password
        const codeForgetPassword = await this.CodeForgetPassword.create({ forgetCode: hash, userId: user._id })
        if (!codeForgetPassword) {
            throw new BadRequestException('Code not saved')
        }

        return
    }

    //=============================== reset password ===============================//
    /**
     * * destructure data from params and body
     * * decode token
     * * check if code is exist
     * * delete code
     * * hash new password
     * * update password and save changes
     */
    async resetPasswordService(param: resetPasswordTokenDto, body: resetPasswordBodyDTO) {
        // * destructure data from params and body
        const { token } = param
        const { password } = body

        // * decode token
        const decoded = this.jwtService.verify(token, { secret: env.RESET_TOKEN })
        if (!decoded) {
            throw new BadRequestException('Token not decoded')
        }

        // * check if code is exist
        const codeForgetPassword = await this.CodeForgetPassword.findOne({ forgetCode: decoded.forgetCode, userId: decoded._id })
        if (!codeForgetPassword) {
            throw new BadRequestException('Code not found')
        }

        // * delete code 
        const isCodeDeleted = await this.CodeForgetPassword.findByIdAndDelete(codeForgetPassword._id)
        if (!isCodeDeleted) {
            throw new BadRequestException('Code not deleted')
        }

        // * hash new password
        const hashNewPassword = bcrypt.hashSync(password, env.SALT_ROUNDS)
        if (!hashNewPassword) {
            throw new BadRequestException('Password not hashed')
        }

        // * update password and save changes
        const user = await this.User.findByIdAndUpdate(decoded._id, { password: hashNewPassword })
        if (!user) {
            throw new BadRequestException('User not found and not updated the password')
        }

        return user
    }


    //======================= convert user account to technical account =======================//
    /**
     * * destructure data from body
     * * destructuring data from authUser
     * * check user
     * * upload national id images
     * * create object to create pending document
     * * create object to create pending document
     */
    async convertToTechnicalService(req: any, body: convertToTechnicalBodyDTO) {
        // * destructure data from body
        const { arabicName, englishName, birthDate, hisSkill } = body
        // * destructuring data from authUser
        const { _id } = req.authUser

        // * check user
        const user = await this.User.findOne({ _id, role: Role.USER })
        if (!user) {
            throw new BadRequestException('User not found')
        }

        if (!user.folderId || !user.Image.public_id || !user.Image.secure_url) {
            throw new BadRequestException('enter your personal picture')
        }

        // * upload national id images
        const folderIdNationalId = UniqueString.generateUniqueString(5);
        let ImageNationalId = [];
        const folder = user.Image.public_id.split(`${user.folderId}/`)[0];

        if (req.files.frontImageNationalId[0].path) {
            const { secure_url, public_id } =
                await cloudinary.uploader.upload(req.files.frontImageNationalId[0].path, {
                    folder: folder + `${user.folderId}/ImageNationalId/${folderIdNationalId}`,
                });
            ImageNationalId.push({ secure_url, public_id });
        } else {
            throw new BadRequestException('enter front Image NationalId')
        }

        if (req.files.backImageNationalId[0].path) {
            const { secure_url, public_id } =
                await cloudinary.uploader.upload(req.files.backImageNationalId[0].path, {
                    folder: folder + `${user.folderId}/ImageNationalId/${folderIdNationalId}`,
                });
            ImageNationalId.push({ secure_url, public_id });
        } else {
            throw new BadRequestException('enter back Image NationalId')
        }

        // * create object to create pending document
        const objPending = {
            arabicName,
            englishName,
            birthDate,
            hisSkill,
            email: user.email,
            phoneNumber: user.phoneNumber,
            userId: _id,
            folderId: user.folderId,
            Image: user.Image,
            folderIdNationalId,
            ImageNationalId
        }

        // * create pending document
        const pending = await this.Pending.create(objPending)
        if (!pending) {
            throw new BadRequestException('Request not send')
        }

        return pending
    }

    //=============================== accept OR Reject =====================================//
    /**
     * * destructure data from params and query
     * * find and delete request pending
     * * check user
     * * if the status of request is accept
     * * send mail to user to inform him about accept his request
     * * send mail to user to inform him about reject his request
     * @returns { user }
     */
    async acceptORRejectService(params: any, query: any): Promise<User> {
        // * destructure data from params and query
        const { status } = query
        const { requestId } = params

        // * find and delete request pending
        const request = await this.Pending.findByIdAndDelete(requestId)
        if (!request) {
            throw new BadRequestException('Request not found')
        }

        // * check user
        const user = await this.User.findById(request.userId)
        if (!user) {
            throw new BadRequestException('User not found')
        }

        // * if the status of request is accept
        if (status === StatusPendingRequest.ACCEPT) {
            user.arabicName = request.arabicName
            user.englishName = request.englishName
            user.birthDate = request.birthDate
            user.hisSkill = request.hisSkill
            user.role = Role.TECHNICAL
            user.folderIdNationalId = request.folderIdNationalId
            user.ImageNationalId = request.ImageNationalId
            await user.save()

            // * send mail to user to inform him about accept his request
            const isEmailSent = await this.sendEmailService.sendEmail(user.email,
                'welcome to our app',
                `<h1>We are som happy to inform you that your requet to convert to a technical position has been acceoted</h1>
                `)
            if (!isEmailSent) {
                throw new InternalServerErrorException(`Email is not sent ${user.email}.`)
            }
        }

        // * send mail to user to inform him about reject his request
        if (StatusPendingRequest.REJECT) {
            const isEmailSent = await this.sendEmailService.sendEmail(user.email,
                'welcome to our app',
                `<h1>we are sorry that your application for convert to technical position was not accepted</h1>ّ
                <h3>we wish you the best of luck in the near future</h3>
                `)
            if (!isEmailSent) {
                throw new InternalServerErrorException(`Email is not sent ${user.email}.`)
            }
        }
        return user
    }
}