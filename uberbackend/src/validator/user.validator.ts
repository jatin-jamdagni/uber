


import z from "zod";

// Register Types
export const userRegisterValidator = z.object({
    firstName: z.string().min(3, { message: "First name must 3 character long" }).max(255),
    password: z.string().min(6, { message: "Password must be of 6 character long" }).max(16),
    email: z.string().email(),
    lastName: z.string().optional()
});
export type UserRegisterBody = z.infer<typeof userRegisterValidator>;


// Signin Types
export const userSigninValidator = z.object({
    email: z.string().email(),
    password: z.string().min(6, { message: "Password must be of 6 character long" }).max(16),
})

export type UserSigninBody = z.infer<typeof userSigninValidator>