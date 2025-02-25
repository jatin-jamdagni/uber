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
const constants_1 = require("../libs/constants");
const userRegisterController = async (req, res, next) => {
    try {
        const result = user_validator_1.userRegisterValidator.safeParse(req.body);
        if (!result.success) {
            return res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({ error: result.error.issues });
        }
        const { email, password, firstName, lastName } = result.data;
        const existingUser = await req.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({ error: constants_1.MESSAGES.USER_EXISTS });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await req.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
            },
        });
        const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "24h" });
        const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
        return res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600000, // 1 hour
        }).status(constants_1.HTTP_STATUS.CREATED).json({ message: constants_1.MESSAGES.USER_REGISTERED, user: userWithoutPassword, token });
    }
    catch (error) {
        return next(error);
    }
};
exports.userRegisterController = userRegisterController;
/**
 * Controller for user sign-in.
 *
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next middleware function.
 * @returns A promise that resolves to any.
 *
 * @description
 * This controller handles the user sign-in process. It performs the following steps:
 * 1. Validates the request body using `userSigninValidator`.
 * 2. Checks if the user exists in the database using the provided email.
 * 3. Verifies the provided password against the stored hashed password.
 * 4. Generates a JWT token if the credentials are valid.
 * 5. Sets the JWT token in an HTTP-only cookie.
 * 6. Responds with the user data (excluding the password) and the token.
 *
 * @throws Will call the next middleware with an error if any step fails.
 */
const userSigninController = async (req, res, next) => {
    try {
        const result = user_validator_1.userSigninValidator.safeParse(req.body);
        if (!result.success) {
            return res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({ error: result.error.issues });
        }
        const { email, password } = result.data;
        const user = await req.prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({ error: constants_1.MESSAGES.USER_NOT_FOUND });
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({ error: constants_1.MESSAGES.INVALID_CREDENTIALS });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "24h" });
        const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600000,
        });
        // Now send the JSON response
        return res.status(constants_1.HTTP_STATUS.OK).json({
            message: constants_1.MESSAGES.USER_SIGNED_IN,
            user: userWithoutPassword,
            token,
        });
    }
    catch (error) {
        return next(error);
    }
};
exports.userSigninController = userSigninController;
const getUserProfileController = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({ error: "User not authenticated" });
        }
        const _a = req.user, { password: _ } = _a, user = __rest(_a, ["password"]);
        return res.status(constants_1.HTTP_STATUS.OK).json({ user: user });
    }
    catch (error) {
        return next(error);
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
        return res.status(constants_1.HTTP_STATUS.OK).json({ message: constants_1.MESSAGES.LOGOUT_SUCCESS });
    }
    catch (error) {
        return next(error);
    }
};
exports.userLogoutController = userLogoutController;
