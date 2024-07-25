import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { arabicNameRegex, englishNameRegex, phoneRegex, Role } from "../../utils";

@Schema({ timestamps: true })

export class User {
    @Prop({
        type: String,
        trim: true,
        min: 10,
        max: 30,
        match: arabicNameRegex
    })
    arabicName: string;

    @Prop({
        type: String,
        trim: true,
        min: 10,
        max: 30,
        match: englishNameRegex
    })
    englishName: string;

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
        required: true,    })
    confirmPassword: string;

    @Prop({
        type: Date,
        max: new Date('2006-12-30'),
        min: new Date('1940-01-01'),
        trim: true
    })
    birthDate: Date;

    @Prop({
        type: String,
        trim: true,
        maxlength: 30,
        minlength: 3
    })
    hisSkill: string

    @Prop({
        required: true,
        type: String,
        default: Role.USER,
        enum: [Role.USER, Role.TECHNICAL]
    })
    role: string

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

    @Prop({
        type: String,
        // required: true,
        unique: true
    })
    folderIdNationalId: string

    @Prop({
        type: [{
            secure_url: { type: String, required: true },
            public_id: { type: String, required: true, unique: true }
        }]
    })
    ImageNationalId: [{ secure_url: string, public_id: string }]

    @Prop({
        required: true,
        type: Boolean,
        default: false
    })
    isEmailVerified: boolean

    @Prop({ type: String, })
    token: string
}
export const UserSchema = SchemaFactory.createForClass(User) 