import {z} from 'zod'

export const signInSchema = z.object({
    isAcceptingMessage: z.boolean(),
    identifer: z.string().nonempty({message: "Identifier is required"}),
    password: z.string().min(6, {message: "Password must be at least 6 characters long"})
})