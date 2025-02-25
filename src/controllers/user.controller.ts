import type { Request, Response, NextFunction } from "express"
import { type UserRegisterBody, userRegisterValidator, userSigninValidator } from "../validator/user.validator"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { HTTP_STATUS, MESSAGES } from "../libs/constants"



export const userRegisterController = async (
    req: Request<{}, {}, UserRegisterBody>,
    res: Response,
    next: NextFunction,
): Promise<any> => {
    try {
        const result = userRegisterValidator.safeParse(req.body)

        if (!result.success) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: result.error.issues })
        }

        const { email, password, firstName, lastName } = result.data
        const existingUser = await req.prisma.user.findUnique({ where: { email } })

        if (existingUser) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: MESSAGES.USER_EXISTS })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await req.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
            },
        })

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: "24h" })

        const { password: _, ...userWithoutPassword } = user;

        return res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600000, // 1 hour
        }).status(HTTP_STATUS.CREATED).json({ message: MESSAGES.USER_REGISTERED, user: userWithoutPassword, token })

    } catch (error) {
        return next(error)
    }
}

/**
 * Controller for user sign-in.
 *
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next middleware function.
 * @returns A promise that resolves to any.
 *
 * @description
 * This controller handles the user sign-in process. It performs the following steps:
 * 1. Validates the request body using `userSigninValidator`.
 * 2. Checks if the user exists in the database using the provided email.
 * 3. Verifies the provided password against the stored hashed password.
 * 4. Generates a JWT token if the credentials are valid.
 * 5. Sets the JWT token in an HTTP-only cookie.
 * 6. Responds with the user data (excluding the password) and the token.
 *
 * @throws Will call the next middleware with an error if any step fails.
 */
export const userSigninController = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const result = userSigninValidator.safeParse(req.body)

        if (!result.success) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: result.error.issues })
        }

        const { email, password } = result.data!;

        const user = await req.prisma.user.findUnique({ where: { email } })
        if (!user) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: MESSAGES.USER_NOT_FOUND })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: MESSAGES.INVALID_CREDENTIALS })
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: "24h" })

        const { password: _, ...userWithoutPassword } = user




        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600000,
        });

        // Now send the JSON response
        return res.status(HTTP_STATUS.OK).json({
            message: MESSAGES.USER_SIGNED_IN,
            user: userWithoutPassword,
            token,
        });

    } catch (error) {
        return next(error)
    }
}

export const getUserProfileController = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        if (!req.user) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: "User not authenticated" })
        }

        const { password: _, ...user } = req.user!
        return res.status(HTTP_STATUS.OK).json({ user: user })
    } catch (error) {
        return next(error)
    }
}

export const userLogoutController = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        res.clearCookie("token")
        const token = req.cookies.token || (req.headers.authorization?.split(" ")[1] ?? null)

        if (token) {
            await req.prisma.blacklistedToken.create({
                data: { token },
            })
        }

        return res.status(HTTP_STATUS.OK).json({ message: MESSAGES.LOGOUT_SUCCESS })
    } catch (error) {
        return next(error)
    }
}

