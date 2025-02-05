"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaMiddleware = exports.prisma = void 0;
const client_1 = require("@prisma/client");
// Prevent multiple instances of Prisma Client in development
exports.prisma = global.prisma || new client_1.PrismaClient();
if (process.env.NODE_ENV !== 'production') {
    global.prisma = exports.prisma;
}
const prismaMiddleware = (req, res, next) => {
    req.prisma = exports.prisma; // Attach Prisma client to the request object
    next();
};
exports.prismaMiddleware = prismaMiddleware;
