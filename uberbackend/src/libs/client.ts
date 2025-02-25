import { PrismaClient } from '@prisma/client'
import { NextFunction, Request, Response } from 'express';

declare global {
    var prisma: PrismaClient | undefined
}

// Prevent multiple instances of Prisma Client in development
export const prisma = global.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
    global.prisma = prisma
}



export const prismaMiddleware = (req: Request, res: Response, next: NextFunction) => {
    req.prisma = prisma; // Attach Prisma client to the request object
    next();
};
