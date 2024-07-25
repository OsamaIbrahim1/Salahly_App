import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { emailRegex, englishNameRegex, phoneRegex, Role } from "../../utils";


@Schema({ timestamps: true })
export class Admin {
    @Prop({
        type: String,
        trim: true,
        min: 10,
        max: 30,
        match: englishNameRegex
    })
    name: string;


    @Prop({
        type: String,
        required: true,
        trim: true,
        unique: true,
        match: emailRegex
    })
    email: string;

    @Prop({
        type: String,
        required: true,
        length: 11,
        unique: true,
        match: phoneRegex
    })
    phoneNumber: string;

    @Prop({
        type: String,
        min: 6,
        required: true,
    })
    password: string;

    @Prop({
        type: String,
        min: 6,
        required: true,
    })
    confirmPassword: string;


    @Prop({
        required: true,
        type: String,
        default: Role.ADMIN,
        enum: [Role.ADMIN]
    })
    role: string;

    @Prop({
        type: String,
        unique: true
    })
    folderId: string;

    @Prop({
        type: {
            secure_url: { type: String, required: true },
            public_id: { type: String, required: true, unique: true }
        }
    })
    Image: { secure_url: string, public_id: string };

    @Prop({
        required: true,
        type: Boolean,
        default: false
    })
    isEmailVerified: boolean

    @Prop({ type: String, })
    token: string;

}

export const AdminSchema = SchemaFactory.createForClass(Admin) 