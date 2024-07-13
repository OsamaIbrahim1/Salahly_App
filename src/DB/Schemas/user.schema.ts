import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { phoneRegex } from "../../utils";

@Schema({ timestamps: true })

export class User {
    @Prop({
        type: String,
        required: true,
        trim: true,
        unique: true
    })
    email: string;

    @Prop({
        type: String,
        required: true,
        length: 11,
        unique: true,
        // match: phoneRegex

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
        default: "user",
        enum: ['user', 'technical']
    })
    role: string

    @Prop({
        required: true,
        type: Boolean,
        default: false
    })
    isEmailVerified: boolean

    @Prop({ type: String, })
    token: string

    @Prop({
        type: String,
        // required: true,
        unique: true
    })
    folderId: string

    @Prop({
        type: {
            secure_url: { type: String, required: true },
            public_id: { type: String, required: true, unique: true }
        }
    })
    Image: { secure_url: string, public_id: string }; // Define image property as an object with nested fields
}


export const UserSchema = SchemaFactory.createForClass(User) 