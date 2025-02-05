import express, { Router } from "express";
import { userRegisterController, userSigninController } from "../controllers/user.controller";

const userRouter: Router = express.Router();

userRouter.post("/register", userRegisterController);
userRouter.post("/signin", userSigninController)

export default userRouter;