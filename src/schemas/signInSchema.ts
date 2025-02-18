import {z} from 'zod'

export const signInSchema = z.object({
    isAcceptingMessage: z.boolean(),
    identifer: z.string().min(3, {message: "Username/email must be at least 3 characters long"}),
    password: z.string().min(6, {message: "Password must be at least 6 characters long"})
})