import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { JwtService } from "@nestjs/jwt";
import { Model } from "mongoose";
import * as bcrypt from "bcrypt"
import { v2 as cloudinary } from "cloudinary";
import * as env from "../../config/app.environments";
import { Admin, User } from "../../DB/Schemas";
import UniqueString from '../../utils/generate-Unique-String'
import { SendEmailService } from "../../common/services";
import { addAdminBodyDTO, updateAdminBodyDTO } from "../../DTO";

@Injectable()
export class AdminServices {
    constructor(
        @InjectModel(Admin.name) private Admin: Model<Admin>,
        @InjectModel(User.name) private User: Model<User>,
        private jwtService: JwtService,
        private sendEmailService: SendEmailService

    ) {
        cloudinary.config({
            cloud_name: env.CLOUD_NAME,
            api_key: env.API_KEY,
            api_secret: env.API_SECRET,
        });
    }

    //=============================== add Admin ===============================//
    /**
     * * destructuring the body
     * * check if email is already exist in admin
     * * check if email is already exist in User
     * * check if phoneNumber is already exist in admin
     * * check if phoneNumber is already exist in User
     * * check if password and confirmPassword are the same
     * * hash the password
     * * generate folderId
     * * upload image
     * * generate token for verification
     * * send verification email
     * * generate object Admin
     * * create Admin
     */
    async addAdmin(req: any, body: addAdminBodyDTO, file: any) {
        // * destructuring the body 
        const { name, email, password, confirmPassword, phoneNumber } = body
        try {
            console.log(body)
            // * check if email is already exist in admin
            const emailAdminExist = await this.Admin.findOne({ email })
            if (emailAdminExist) {
                throw new BadRequestException({ message: 'Email is already exist', statusCode: 400 })
            }

            // * check if email is already exist in User
            const emailUserExist = await this.User.findOne({ email })
            if (emailUserExist) {
                throw new BadRequestException({ message: 'Email is already exist', statusCode: 400 })
            }

            // * check if phoneNumber is already exist in admin
            const phoneAdminExist = await this.Admin.findOne({ phoneNumber })
            if (phoneAdminExist) {
                throw new BadRequestException({ message: 'Phone Number is already exist', statusCode: 400 })
            }

            // * check if phoneNumber is already exist in User
            const phoneUserExist = await this.User.findOne({ phoneNumber })
            if (phoneUserExist) {
                throw new BadRequestException({ message: 'Phone Number is already exist', statusCode: 400 })
            }

            // * check if password and confirmPassword are the same
            if (password !== confirmPassword) {
                throw new BadRequestException({ message: 'Password and Confirm Password are not the same', statusCode: 400 })
            }

            // * hash the password
            const hashPassword = await bcrypt.hash(password, env.SALT_ROUNDS)
            if (!hashPassword) {
                throw new BadRequestException({ message: 'Password is not hashed', statusCode: 400 })
            }

            if (!file) {
                throw new BadRequestException({ message: 'Please upload image', statusCode: 400 })
            }

            // * generate folderId
            const folderId = UniqueString.generateUniqueString(5);

            // * upload image
            const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
                folder: `${env.MAIN_FOLDER}/admins/${folderId}`,
            })

            // * generate token for verification
            const token = this.jwtService.sign({ email }, { secret: env.SECRET_VERIFICATION_TOKEN, expiresIn: env.TIME_EXPIRE_TOKEN })
            const confirmationLink = `${req.protocol}://${req.headers.host}/admin/confirm-email/${token}`


            // * send verification email
            const isEmailSent = await this.sendEmailService.sendEmail(
                email,
                'welcome to our app', `<h1>Click on the link to confirm your email</h1>
            <a href="${confirmationLink}">Confirm Email</a>`
            )
            if (!isEmailSent) {
                throw new InternalServerErrorException({ message: `Email is not sent ${email}.`, statusCode: 400 })
            }

            // * generate object Admin
            const adminObj = {
                name,
                email,
                phoneNumber,
                password: hashPassword,
                confirmPassword: hashPassword,
                folderId,
                Image: { secure_url, public_id },
            }

            // * create Admin
            const admin = await this.Admin.create(adminObj)
            if (!admin) {
                throw new InternalServerErrorException({ message: 'Admin is not created', statusCode: 500 })
            }

            return admin
        } catch (err) {
            throw new HttpException({
                error: err['response'].message,
                status: err['response'].statusCode,
                timestamp: new Date().toISOString()
            }, err['response'].statusCode, {
                cause: err
            });
        }
    }


    //================================= verify Admin Account ===============================//
    /**
     * * destructuring the token from the params
     * * decoded data from token
     * * verify email
     */
    async verifyAdminAccountServices(req: any) {
        // * destructuring the token from the params
        const { token } = req.params

        try {
            // * decoded data from token
            const decodedData = this.jwtService.verify(token, { secret: env.SECRET_VERIFICATION_TOKEN })
            if (!decodedData) {
                throw new BadRequestException({ message: 'token data is not valid.', statusCode: 400 })
            }

            // * verify email 
            const user = await this.Admin.findOneAndUpdate({ email: decodedData.email, isEmailVerified: false }, { isEmailVerified: true }, { new: true })
            if (!user) {
                throw new NotFoundException({ message: 'Admin not found.', statusCode: 404 })
            }

            return
        } catch (err) {
            throw new HttpException({
                error: err['response'].message,
                status: err['response'].statusCode,
                timestamp: new Date().toISOString()
            }, err['response'].statusCode, {
                cause: err
            });
        }
    }

    //================================= logIn Admin ===============================//
    /**
     * * destructuring the body
     * * check if email is exist
     * * check password is matches
     * * generate token
     * * save the token
     */
    async loginAdminServices(body: any) {
        // * destructuring the body
        const { email, password } = body
        try {
            // * check if email is exist
            const checkEmailExists = await this.Admin.findOne({ email, isEmailVerified: true })
            if (!checkEmailExists) {
                throw new BadRequestException({ message: 'Email not found or not verified.', statusCode: 400 })
            }

            // * check password is matches
            const isPasswordMatch = bcrypt.compareSync(password, checkEmailExists.password)
            if (!isPasswordMatch) {
                throw new BadRequestException({ message: 'Password is not correct.', statusCode: 400 })
            }

            // * generate token
            const token = this.jwtService.sign({ email, _id: checkEmailExists._id, role: checkEmailExists.role }, { secret: env.SECRET_LOGIN_TOKEN, expiresIn: env.TIME_EXPIRE_TOKEN })
            if (!token) {
                throw new BadRequestException({ message: 'Token is not generated.', statusCode: 400 })
            }

            // * save the token
            checkEmailExists.token = token
            await checkEmailExists.save()

            return token

        } catch (err) {
            throw new HttpException({
                error: err['response'].message,
                status: err['response'].statusCode,
                timestamp: new Date().toISOString()
            }, err['response'].statusCode, {
                cause: err
            });
        }
    }

    //================================= get data Admin ===============================//
    /**
     * * destructuring data from headers
     * * get admin data
     */
    async getAdminDataServices(req: any) {
        // * destructuring data from headers
        const { _id } = req.authUser

        try {
            // * get admin data
            const admin = await this.Admin.findById(_id, "name email phoneNumber role Image.secure_url -_id")
            if (!admin) {
                throw new NotFoundException({ message: 'admin not found', statusCode: 404 })
            }

            return admin

        } catch (err) {
            throw new HttpException({
                error: err['response'].message,
                status: err['response'].statusCode,
                timestamp: new Date().toISOString()
            }, err['response'].statusCode, {
                cause: err
            });
        }
    }

    //========================= update Admin ===============================//
    /**
     * * destructuring data from body
     * * destructuring data from headers
     * * check if email is already exist in admin
     *  * if admin wants to update the name
     * * check if admin wants to update the email
     * * check if this email not user or technical
     * * check if admin wants to update the phoneNumber
     * * check if phoneNumber is already exist in admin
     * * check if phoneNumber is already exist in User
     * * if admin wants to update the image
     * * update image and use same public id  and folder id
     * * save the admin
     */
    async updateAdminServices(req: any, body: updateAdminBodyDTO) {
        // * destructuring data from body
        const { name, email, phoneNumber, oldPublicId } = body
        // * destructuring data from headers
        const { _id } = req.authUser

        try {
            // * check if email is already exist in admin
            const adminExist = await this.Admin.findById(_id)
            if (!adminExist) {
                throw new NotFoundException({ message: 'admin is not found', statusCode: 404 })
            }

            // * if admin wants to update the name
            if (name) {
                if (name === adminExist.name) {
                    throw new BadRequestException({ message: 'name is already same old name', statusCode: 400 })
                }
                adminExist.name = name
            }

            // * check if admin wants to update the email
            if (email) {
                if (email === adminExist.email) {
                    throw new BadRequestException({ message: 'email is already same old email', statusCode: 400 })
                }

                const checkEmailExists = await this.Admin.findOne({ email })
                if (checkEmailExists) {
                    throw new BadRequestException({ message: 'email is already exist', statusCode: 400 })
                }
                // * check if this email not user or technical
                const checkEmailUser = await this.User.findOne({ email })
                if (checkEmailUser) {
                    throw new BadRequestException({ message: 'email is already exist, enter your email address', statusCode: 400 })
                }
                adminExist.email = email
            }

            // * check if admin wants to update the phoneNumber
            if (phoneNumber) {
                if (phoneNumber === adminExist.phoneNumber) {
                    throw new BadRequestException({ message: 'phoneNumber is already same old phoneNumber', statusCode: 400 })
                }

                // * check if phoneNumber is already exist in admin
                const checkPhoneExists = await this.Admin.findOne({ phoneNumber })
                if (checkPhoneExists) {
                    throw new BadRequestException({ message: 'phoneNumber is already exist', statusCode: 400 })
                }

                // * check if phoneNumber is already exist in User
                const checkPhoneUser = await this.User.findOne({ phoneNumber })
                if (checkPhoneUser) {
                    throw new BadRequestException({ message: 'phoneNumber is already exist, enter your phoneNumber', statusCode: 400 })
                }
                adminExist.phoneNumber = phoneNumber
            }

            // * if admin wants to update the image
            if (oldPublicId) {
                console.log("req.file.path", req.file.path)
                if (!req.file.path) {
                    throw new BadRequestException('Please upload image')
                }

                const newPublicId = oldPublicId.split(`${adminExist.folderId}/`)[1];

                // * update image and use same public id  and folder id
                const { secure_url, public_id } =
                    await cloudinary.uploader.upload(req.file.path, {
                        folder: `${env.MAIN_FOLDER}/admins/${adminExist.folderId}`,
                        public_id: newPublicId,
                    });
                adminExist.Image.secure_url = secure_url;
            }

            // * save the admin
            await adminExist.save()

            return adminExist
        } catch (err) {
            throw new HttpException({
                error: err['response'].message,
                status: err['response'].statusCode,
                timestamp: new Date().toISOString()
            }, err['response'].statusCode, {
                cause: err
            });
        }
    }

    //========================= delete Admin ===============================//
    /**
     * * destructuring data from headers
     * * delete admin
     * * delete image from cloudinary
     */
    async deleteAdminServices(req: any) {
        // * destructuring data from headers
        const { _id } = req.authUser

        try {
            // * delete admin 
            const admin = await this.Admin.findByIdAndDelete(_id)
            if (!admin) {
                throw new NotFoundException({ message: 'admin not found and not deleted', statusCode: 404 })
            }

            // * delete image from cloudinary
            await cloudinary.api.delete_resources_by_prefix(
                `${env.MAIN_FOLDER}/admins/${admin.folderId}`
            );
            await cloudinary.api.delete_folder(
                `${env.MAIN_FOLDER}/admins/${admin.folderId}`
            );
            return admin
        } catch (err) {
            throw new HttpException({
                error: err['response'].message,
                status: err['response'].statusCode,
                timestamp: new Date().toISOString()
            }, err['response'].statusCode, {
                cause: err
            });
        }
    }
}