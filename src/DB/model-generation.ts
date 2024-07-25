import { MongooseModule } from "@nestjs/mongoose";

import { Pending, PendingSchema, User, UserSchema, CodeForgetPassword, CodeForgetPasswordSchema, Admin, AdminSchema } from './Schemas'

export const models = MongooseModule.forFeature(
    [{
        name: User.name, schema: UserSchema
    }, {
        name: Pending.name, schema: PendingSchema
    }, {
        name: CodeForgetPassword.name, schema: CodeForgetPasswordSchema
    }, {
        name: Admin.name, schema: AdminSchema
    }
    ])
