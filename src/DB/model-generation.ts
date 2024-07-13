import { MongooseModule } from "@nestjs/mongoose";

import { User, UserSchema } from './Schemas'
import { CodeForgetPassword, CodeForgetPasswordSchema } from './Schemas'

export const models = MongooseModule.forFeature([{ name: User.name, schema: UserSchema }, { name: CodeForgetPassword.name, schema: CodeForgetPasswordSchema }])