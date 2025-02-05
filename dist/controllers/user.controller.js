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
exports.userSigninController = exports.userRegisterController = void 0;
const user_validator_1 = require("../validator/user.validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userRegisterController = async (req, res, next) => {
    try {
        const result = user_validator_1.userRegisterValidator.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ error: result.error.issues });
        }
        const validatedData = result.data;
        const existUser = await req.prisma.user.findFirst({ where: { email: validatedData.email } });
        if (existUser) {
            return res.status(400).json({ error: "User already exists" });
        }
        validatedData.password = await bcryptjs_1.default.hash(validatedData.password, 10);
        await req.prisma.user.create({ data: validatedData });
        return res.status(201).json({ message: "User registered successfully" });
    }
    catch (error) {
        next(error); // Pass errors to Express error handler
    }
};
exports.userRegisterController = userRegisterController;
const userSigninController = async (req, res, next) => {
    try {
        const result = user_validator_1.userSigninValidator.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ error: result.error.issues });
        }
        const validatedData = result.data;
        const userExist = await req.prisma.user.findUnique({ where: { email: validatedData.email } });
        if (!userExist) {
            return res.status(401).json({ error: "User does not exist" });
        }
        const isPasswordValid = await bcryptjs_1.default.compare(validatedData.password, userExist.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        const token = jsonwebtoken_1.default.sign({ id: userExist.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        const { password, id } = userExist, user = __rest(userExist, ["password", "id"]);
        return res.status(200).json({ message: "User signed in successfully", user, token });
    }
    catch (error) {
        next(error);
    }
};
exports.userSigninController = userSigninController;
