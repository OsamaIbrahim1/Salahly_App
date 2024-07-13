import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/DB/Schemas/user.schema";
import * as bcrypt from "bcrypt"
import * as env from "../../config/app.environments";
import { JwtService } from '@nestjs/jwt'
import { SendEmailService } from "../../common/services";
import { signInBodyDTO, signUpBodyDTO } from "../../DTO";

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private User: Model<User>,
        private jwtService: JwtService,
        private sendEmailService: SendEmailService
    ) { }

    //=========================== Sign Up ==========================//
    /**
     * * destructure data from body
     * * check if email already exists
     * * Check the password same confirmPassword
     * * hash the password
     * * generate object User
     * * create new User
     */
    async signUpService(req: any, body: signUpBodyDTO) {
        // * destructure data from body
        const { email, password, confirmPassword, phoneNumber } = body

        // * check if email already exists
        const checkEmailExists = await this.User.findOne({ email })
        if (checkEmailExists) {
            throw new BadRequestException('Email already exists, Please Enter new email address.')
        }

        // * Check the password same confirmPassword 
        if (password !== confirmPassword) {
            throw new BadRequestException('Confirm password not match with password, Please Enter password and Confirm Password again.')
        }

        // * hash the password
        const hashPassword = bcrypt.hashSync(password, env.SALT_ROUNDS)

        // * create token
        const token = this.jwtService.sign({ email }, { secret: env.SECRET_VERIFICATION_TOKEN, expiresIn: env.TIME_EXPIRE_TOKEN })
        const confirmationLink = `${req.protocol}://${req.headers.host}/auth/confirm-email/${token}`

        // * send email
        const isEmailSent = await this.sendEmailService.sendEmail(email,
            'welcome to our app', `<h1>Click on the link to confirm your email</h1>
            <a href="${confirmationLink}">Confirm Email</a>`)

        if (!isEmailSent) {
            throw new InternalServerErrorException(`Email is not sent ${email}.`)
        }

        // * generate object User
        const UserObject = {
            email,
            password: hashPassword,
            confirmPassword: hashPassword,
            phoneNumber
        }

        // * create new User
        const user = await this.User.create(UserObject)
        if (!user) { throw new BadRequestException('User not created.') }

        return user
    }

    //============================= verification email =============================//
    /**
     * * destructure data from params
     * * decoded data from token
     * * verify email
     */
    async verifyEmailService(req: any) {
        // * destructure data from params
        const { token } = req.params

        // * decoded data from token
        const decodedData = this.jwtService.verify(token, { secret: env.SECRET_VERIFICATION_TOKEN })
        if (!decodedData) {
            throw new BadRequestException('token data is not valid.')
        }

        // * verify email 
        const user = await this.User.findOneAndUpdate({ email: decodedData.email, isEmailVerified: false }, { isEmailVerified: true }, { new: true })
        if (!user) {
            throw new BadRequestException('User not found.')
        }

        return
    }

    //============================= Sign In =============================//
    /**
     * * destructure data from body
     * * check if email is exist
     * * check password is matches
     * * generate token 
     * * save the token
     */
    async SignInService(body: signInBodyDTO) {
        // * destructure data from body
        const { email, password } = body

        // * check if email is exist
        const checkEmailExists = await this.User.findOne({ email, isEmailVerified: true })
        if (!checkEmailExists) {
            throw new BadRequestException('Email not found or not verified.')
        }

        // * check password is matches
        const passwordMatch = bcrypt.compareSync(password, checkEmailExists.password)
        if (!passwordMatch) {
            throw new BadRequestException('Password not matches, Please enter password again.')
        }

        // * generate token 
        const token = this.jwtService.sign({ email, _id: checkEmailExists._id, role: checkEmailExists.role }, { secret: env.SECRET_LOGIN_TOKEN, expiresIn: env.TIME_EXPIRE_TOKEN })
        if (!token) {
            throw new BadRequestException('token not generated.')
        }

        // * save the token
        checkEmailExists.token = token
        await checkEmailExists.save()

        return token
    }
}