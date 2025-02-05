"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSigninValidator = exports.userRegisterValidator = void 0;
const zod_1 = __importDefault(require("zod"));
// Register Types
exports.userRegisterValidator = zod_1.default.object({
    firstName: zod_1.default.string().min(3, { message: "First name must 3 character long" }).max(255),
    password: zod_1.default.string().min(6, { message: "Password must be of 6 character long" }).max(16),
    email: zod_1.default.string().email(),
    lastName: zod_1.default.string().optional()
});
// Signin Types
exports.userSigninValidator = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(6, { message: "Password must be of 6 character long" }).max(16),
});
