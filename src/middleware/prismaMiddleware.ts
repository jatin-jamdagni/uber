import { Request, Response, NextFunction } from 'express'
import { prisma } from "../libs/client"
export const prismaMiddleware = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    req.prisma = prisma
    next()
}


/*
Attaches the Prisma client to every request object
Makes it available in all route handlers
Calls next() to pass control to the next middleware
 */

