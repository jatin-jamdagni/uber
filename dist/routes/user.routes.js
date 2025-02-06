"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const userRouter = express_1.default.Router();
userRouter.post("/register", user_controller_1.userRegisterController);
userRouter.post("/signin", user_controller_1.userSigninController);
userRouter.get("/logout", auth_middleware_1.authMiddleware, user_controller_1.userLogoutController);
userRouter.get("/profile", auth_middleware_1.authMiddleware, user_controller_1.getUserProfileController);
exports.default = userRouter;
