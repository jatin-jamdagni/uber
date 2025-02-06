"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestOverloaderMiddleware = void 0;
const client_1 = require("../libs/client");
const requestOverloaderMiddleware = (req, _res, next) => {
    if (!req.prisma) {
        console.warn('Prisma client is missing from the request object.');
    }
    if (!req.user) {
        console.warn('User is missing from the request object.');
    }
    if (!req.captain)
        ("Captain is missing from the request object.");
    req.prisma = client_1.prisma;
    next();
};
exports.requestOverloaderMiddleware = requestOverloaderMiddleware;
/*
Attaches the Prisma client to every request object
Makes it available in all route handlers
Calls next() to pass control to the next middleware
 */
