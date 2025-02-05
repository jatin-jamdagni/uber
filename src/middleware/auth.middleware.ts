import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const token = req.cookies.token || (req.headers.authorization ? req.headers.authorization.split(' ')[1] : null);

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const blackListedToken = await req.prisma.blacklistedToken.findFirst({
            where: {
                token: token
            }
        });

        if (blackListedToken) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
        if (typeof decoded !== 'object' || !decoded.id) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        const user = await req.prisma.user.findUnique({
            where: {
                id: decoded.id
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Unauthorized" });
    }
}

export default authMiddleware;
