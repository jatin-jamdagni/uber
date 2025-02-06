"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.captainAuthMiddleware = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../libs/constants");
const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token || (req.headers.authorization ? req.headers.authorization.split(' ')[1] : null);
    if (!token) {
        return res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({ error: constants_1.MESSAGES.UNAUTHORIZED });
    }
    try {
        const blackListedToken = await req.prisma.blacklistedToken.findFirst({
            where: {
                token: token
            }
        });
        if (blackListedToken) {
            return res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({ error: constants_1.MESSAGES.UNAUTHORIZED });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (typeof decoded !== 'object' || !decoded.id) {
            return res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({ error: constants_1.MESSAGES.INVALID_TOKEN });
        }
        const user = await req.prisma.user.findFirst({
            where: {
                id: decoded.id
            }
        });
        if (!user) {
            return res.status(constants_1.HTTP_STATUS.INVALID_REQUEST).json({ error: constants_1.MESSAGES.USER_NOT_FOUND });
        }
        req.user = user;
        return next();
    }
    catch (error) {
        return res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({ error: constants_1.MESSAGES.UNAUTHORIZED });
    }
};
exports.authMiddleware = authMiddleware;
const captainAuthMiddleware = async (req, res, next) => {
    const token = req.cookies.token || (req.headers.authorization ? req.headers.authorization.split(' ')[1] : null);
    if (!token) {
        return res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({ error: constants_1.MESSAGES.UNAUTHORIZED });
    }
    try {
        const blackListedToken = await req.prisma.blacklistedToken.findFirst({
            where: {
                token: token
            }
        });
        if (blackListedToken) {
            return res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({ error: constants_1.MESSAGES.UNAUTHORIZED });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (typeof decoded !== 'object' || !decoded.id) {
            return res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({ error: constants_1.MESSAGES.INVALID_TOKEN });
        }
        const captain = await req.prisma.captain.findFirst({
            where: {
                id: decoded.id
            }
        });
        if (!captain) {
            return res.status(constants_1.HTTP_STATUS.INVALID_REQUEST).json({ error: constants_1.MESSAGES.CAPTAIN_NOT_FOUND });
        }
        req.captain = captain;
        return next();
    }
    catch (error) {
        return res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({ error: constants_1.MESSAGES.UNAUTHORIZED });
    }
};
exports.captainAuthMiddleware = captainAuthMiddleware;
