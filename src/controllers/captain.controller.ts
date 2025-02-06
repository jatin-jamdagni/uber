import bcrypt from 'bcryptjs';
import { HTTP_STATUS, MESSAGES } from '../libs/constants';
import { captainRegistermodel, captainRegisterValidator } from './../validator/captain.validator';
import { Request, Response, NextFunction } from "express"
import { UserSigninBody, userSigninValidator } from '../validator/user.validator';
import jwt from "jsonwebtoken"

export const captainRegisterController = async (req: Request<{}, {}, captainRegistermodel>, res: Response, next: NextFunction): Promise<any> => {

    const result = captainRegisterValidator.safeParse(req.body);

    if (!result.success) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: result.error.issues })
    }
    try {


        const { email,
            firstName, lastName, password, vehicle,
        } = result.data!;

        const existingCaptain = await req.prisma.captain.findUnique({
            where: { email }
        });

        if (existingCaptain) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                error: MESSAGES.CAPTAIN_EXISTS
            })
        };

        const hashedPassword = await bcrypt.hash(password, 10)

        const captain = await req.prisma.captain.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                vehicle: {
                    create: {
                        capacity: vehicle.capacity,
                        color: vehicle.color,
                        plate: vehicle.plate,
                        type: vehicle.vehicleType
                    }
                }

            }
        })

        const { password: _, ...captainWithoutPassword } = captain;
        const token = jwt.sign({ id: captain.id }, process.env.JWT_SECRET!, { expiresIn: "24h" })

        return res.status(HTTP_STATUS.CREATED).json({ message: MESSAGES.CAPTAIN_REGISTERED, captain: captainWithoutPassword, token }).cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600000,
        })

    } catch (error) {
        return next(error)
    }
}


export const captainSigninController = async (req: Request<{}, {}, UserSigninBody>, res: Response, next: NextFunction): Promise<any> => {

    const result = userSigninValidator.safeParse(req.body);


    if (!result.success) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: result.error.issues })
    }

    try {
        const { email, password } = result.data!;
        const captain = await req.prisma.captain.findUnique({ where: { email } })
        if (!captain) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: MESSAGES.CAPTAIN_NOT_FOUND })
        }
        

        const isPasswordValid = await bcrypt.compare(password, captain.password);
        if (!isPasswordValid) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: MESSAGES.INVALID_CREDENTIALS })
        }
        const token = jwt.sign({ id: captain.id }, process.env.JWT_SECRET!, { expiresIn: "24h" })

        const { password: _, ...captainWithoutPassword } = captain;

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600000,
        });

        return res.status(HTTP_STATUS.OK).json({
            message: MESSAGES.CAPTAIN_SIGNED_IN,
            user: captainWithoutPassword,
            token,
        })

    } catch (error) {
        return next(error)
    }
}


export const getCaptainProfileController = async (req: Request<{}, {}, UserSigninBody>, res: Response, next: NextFunction): Promise<any> => {
    try {
        if (!req.captain) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: "Captain not authenticated" })
        }
        const { password: _, ...captain } = req.captain!

        res.status(HTTP_STATUS.OK).json({ captain: captain })
    } catch (error) {
        return next(error)
    }
}


export const captainLogoutController = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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
        return  next(error)
    }
}

