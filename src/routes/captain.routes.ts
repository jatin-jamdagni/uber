import express from "express";
import { captainLogoutController, captainRegisterController, captainSigninController, getCaptainProfileController } from "../controllers/captain.controller";
import { captainAuthMiddleware } from "../middleware/auth.middleware";

const captainRouter = express.Router();



captainRouter.post("/register", captainRegisterController)
captainRouter.post("/signin", captainSigninController)
captainRouter.get("/logout", captainAuthMiddleware, captainLogoutController)
captainRouter.get("/profile", captainAuthMiddleware, getCaptainProfileController);

export default captainRouter