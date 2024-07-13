import { emailRegex, passwordRegex, phoneRegex } from '../../utils'
import { z } from 'zod'


export const updatePasswordSchema = z.object({
    oldPassword: z.string().regex(passwordRegex, { message: 'invalid format old password' }),
    newPassword: z.string().regex(passwordRegex, { message: 'invalid format new password' }),
})

export type CreatePropertyZodDto = z.infer<typeof updatePasswordSchema>

