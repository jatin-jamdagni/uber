import express, { Router } from "express";
import { getUserProfileController, userLogoutController, userRegisterController, userSigninController } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const userRouter: Router = express.Router();

userRouter.post("/register", userRegisterController);
userRouter.post("/signin", userSigninController);
userRouter.get("/logout", authMiddleware, userLogoutController)
userRouter.get("/profile", authMiddleware, getUserProfileController);


export default userRouter;