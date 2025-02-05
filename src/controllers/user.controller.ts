import type { Request, Response, NextFunction } from "express"
import { type UserRegisterBody, userRegisterValidator, userSigninValidator } from "../validator/user.validator"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    INTERNAL_SERVER_ERROR: 500,
}

const MESSAGES = {
    USER_REGISTERED: "User registered successfully",
    USER_EXISTS: "User already exists",
    USER_SIGNED_IN: "User signed in successfully",
    USER_NOT_FOUND: "User does not exist",
    INVALID_CREDENTIALS: "Invalid email or password",
    LOGOUT_SUCCESS: "Logout successful",
}

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

        await req.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
            },
        })

        res.status(HTTP_STATUS.CREATED).json({ message: MESSAGES.USER_REGISTERED })
    } catch (error) {
        next(error)
    }
}

export const userSigninController = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const result = userSigninValidator.safeParse(req.body)

        if (!result.success) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: result.error.issues })
        }

        const { email, password } = result.data

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
            maxAge: 3600000, // 1 hour
        })

        res.status(HTTP_STATUS.OK).json({
            message: MESSAGES.USER_SIGNED_IN,
            user: userWithoutPassword,
            token,
        })
    } catch (error) {
        next(error)
    }
}

export const getUserProfileController = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        if (!req.user) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: "User not authenticated" })
        }
        res.status(HTTP_STATUS.OK).json(req.user)
    } catch (error) {
        next(error)
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
        next(error)
    }
}

