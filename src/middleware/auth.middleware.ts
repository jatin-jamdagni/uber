import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { HTTP_STATUS, MESSAGES } from "../libs/constants";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const token = req.cookies.token || (req.headers.authorization ? req.headers.authorization.split(' ')[1] : null);

    if (!token) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: MESSAGES.UNAUTHORIZED });
    }

    try {
        const blackListedToken = await req.prisma.blacklistedToken.findFirst({
            where: {
                token: token
            }
        });

        if (blackListedToken) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: MESSAGES.UNAUTHORIZED });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
        if (typeof decoded !== 'object' || !decoded.id) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: MESSAGES.INVALID_TOKEN });
        }

        const user = await req.prisma.user.findFirst({
            where: {
                id: decoded.id
            }
        });

        if (!user) {
            return res.status(HTTP_STATUS.INVALID_REQUEST).json({ error: MESSAGES.USER_NOT_FOUND });
        }
        req.user = user;
        return  next();
    } catch (error) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: MESSAGES.UNAUTHORIZED });
    }
}

export const captainAuthMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const token = req.cookies.token || (req.headers.authorization ? req.headers.authorization.split(' ')[1] : null);

    if (!token) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: MESSAGES.UNAUTHORIZED });
    }

    try {
        const blackListedToken = await req.prisma.blacklistedToken.findFirst({
            where: {
                token: token
            }
        });

        if (blackListedToken) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: MESSAGES.UNAUTHORIZED });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
        if (typeof decoded !== 'object' || !decoded.id) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: MESSAGES.INVALID_TOKEN });
        }

        const captain = await req.prisma.captain.findFirst({
            where: {
                id: decoded.id
            }
        });

        if (!captain) {
            return res.status(HTTP_STATUS.INVALID_REQUEST).json({ error: MESSAGES.CAPTAIN_NOT_FOUND });
        }

        req.captain = captain;
        return  next();

    } catch (error) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: MESSAGES.UNAUTHORIZED });
    }
}