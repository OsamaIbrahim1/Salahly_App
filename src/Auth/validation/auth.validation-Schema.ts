import { emailRegex, passwordRegex, phoneRegex } from '../../utils'
import { z } from 'zod'


export const signUpSchema = z.object({
    email: z.string().email().regex(emailRegex, 'invalid email'),
    phoneNumber: z.string().regex(phoneRegex, 'invalid phone number').length(11),
    password: z.string().regex(passwordRegex, "invalid password, must be contain uppercase and lowercase and number"),
    confirmPassword: z.string().regex(passwordRegex, "invalid confirm password, must be match password"),
}).required()

// .superRefine((val: any, cxt: any) => {
//     if (val.password !== val.confirmPassword) {
//         cxt.addIssue({
//             code: z.ZodIssueCode.custom,
//             message: "password and confirm password must be the same",
//             path: ['confirmPassword']
//         })
//     }
// })

export const signInSchema = z.object({
    email: z.string().email().regex(emailRegex, 'invalid email'),
    password: z.string().regex(passwordRegex, "invalid password, must be contain uppercase and lowercase and number"),
}).required()

