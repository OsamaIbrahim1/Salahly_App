import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({ timestamps: true })

export class CodeForgetPassword {
    @Prop({
        type: String,
        required: true,
        trim: true
    })
    forgetCode: string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,

    })
    userId: object
}

export const CodeForgetPasswordSchema = SchemaFactory.createForClass(CodeForgetPassword) 