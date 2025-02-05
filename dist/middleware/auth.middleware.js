"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = async (req, res, next) => {
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
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
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
    }
    catch (error) {
        return res.status(401).json({ error: "Unauthorized" });
    }
};
exports.default = authMiddleware;
