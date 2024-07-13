import { Injectable } from "@nestjs/common";
import * as nodemailer from 'nodemailer';

@Injectable()
export class SendEmailService {
    constructor() { }


    // send email service
    async sendEmail(
        to: string | string[],
        subject: string,
        message: string,
        attachments?: [],
    ) {
        // email configuration
        const transporter = nodemailer.createTransport({
            host: "localhost",
            service: "gmail",
            port: 587,
            secure: false,
            auth: {
                user: 'osamaibrah10@gmail.com',
                pass: 'qpzanyonmckywreq',
            },
        });
        const info = await transporter.sendMail({
            from: `"Fred Foo 👻" <${process.env.EMAIL}>`, // sender address
            to: to ? to : '', // list of receivers
            subject: subject ? subject : 'Hello', // Subject line
            html: message ? message : "", // html body
            attachments,
        });
        if (info.accepted.length) {
            return true
        }
        return false
    };
}
