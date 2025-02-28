import { Router } from "express";
import { authMiddleware, captainAuthMiddleware } from "../middleware/auth.middleware";
import { ConfirmRide, createRide, EndRide, GetFare, StartRide } from "../controllers/rides.controller";


const ridesRouter = Router();



ridesRouter.get("/get-fare", authMiddleware, GetFare);
ridesRouter.post("/create-ride", authMiddleware, createRide)
ridesRouter.post("confirm-ride", captainAuthMiddleware, ConfirmRide);
ridesRouter.post("confirm-ride", captainAuthMiddleware, ConfirmRide)
ridesRouter.get("/start-ride", captainAuthMiddleware, StartRide)
ridesRouter.post("/end-ride", captainAuthMiddleware, EndRide)

export default ridesRouter