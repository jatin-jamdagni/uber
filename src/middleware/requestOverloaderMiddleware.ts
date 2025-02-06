import { Request, Response, NextFunction } from 'express';
import { prisma } from "../libs/client";

export const requestOverloaderMiddleware = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    // Log warnings if the expected properties are missing
    // if (!req.prisma) {
    //     console.warn('Prisma client is missing from the request object.');
    // }
    // if (!req.user) {
    //     console.warn('User is missing from the request object.');
    // }
    // if (!req.captain) {
    //     console.warn('Captain is missing from the request object.');
    // }

    // Attach Prisma client to the request object
    req.prisma = prisma;

    // Proceed to the next middleware or route handler
    next();
};
