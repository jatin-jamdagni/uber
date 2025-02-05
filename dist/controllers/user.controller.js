"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLogoutController = exports.getUserProfileController = exports.userSigninController = exports.userRegisterController = void 0;
const user_validator_1 = require("../validator/user.validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    INTERNAL_SERVER_ERROR: 500,
};
const MESSAGES = {
    USER_REGISTERED: "User registered successfully",
    USER_EXISTS: "User already exists",
    USER_SIGNED_IN: "User signed in successfully",
    USER_NOT_FOUND: "User does not exist",
    INVALID_CREDENTIALS: "Invalid email or password",
    LOGOUT_SUCCESS: "Logout successful",
};
const userRegisterController = async (req, res, next) => {
    try {
        const result = user_validator_1.userRegisterValidator.safeParse(req.body);
        if (!result.success) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: result.error.issues });
        }
        const { email, password, firstName, lastName } = result.data;
        const existingUser = await req.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: MESSAGES.USER_EXISTS });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        await req.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
            },
        });
        res.status(HTTP_STATUS.CREATED).json({ message: MESSAGES.USER_REGISTERED });
    }
    catch (error) {
        next(error);
    }
};
exports.userRegisterController = userRegisterController;
const userSigninController = async (req, res, next) => {
    try {
        const result = user_validator_1.userSigninValidator.safeParse(req.body);
        if (!result.success) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: result.error.issues });
        }
        const { email, password } = result.data;
        const user = await req.prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: MESSAGES.USER_NOT_FOUND });
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: MESSAGES.INVALID_CREDENTIALS });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "24h" });
        const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600000, // 1 hour
        });
        res.status(HTTP_STATUS.OK).json({
            message: MESSAGES.USER_SIGNED_IN,
            user: userWithoutPassword,
            token,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.userSigninController = userSigninController;
const getUserProfileController = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: "User not authenticated" });
        }
        res.status(HTTP_STATUS.OK).json(req.user);
    }
    catch (error) {
        next(error);
    }
};
exports.getUserProfileController = getUserProfileController;
const userLogoutController = async (req, res, next) => {
    var _a, _b;
    try {
        res.clearCookie("token");
        const token = req.cookies.token || ((_b = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]) !== null && _b !== void 0 ? _b : null);
        if (token) {
            await req.prisma.blacklistedToken.create({
                data: { token },
            });
        }
        return res.status(HTTP_STATUS.OK).json({ message: MESSAGES.LOGOUT_SUCCESS });
    }
    catch (error) {
        next(error);
    }
};
exports.userLogoutController = userLogoutController;
