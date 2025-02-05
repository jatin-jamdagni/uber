"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaMiddleware = void 0;
const client_1 = require("../libs/client");
const prismaMiddleware = (req, _res, next) => {
    req.prisma = client_1.prisma;
    next();
};
exports.prismaMiddleware = prismaMiddleware;
/*
Attaches the Prisma client to every request object
Makes it available in all route handlers
Calls next() to pass control to the next middleware
 */
