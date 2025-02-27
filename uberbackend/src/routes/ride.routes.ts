import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { createRide, GetFare } from "../controllers/rides.controller";


const ridesRouter = Router();



ridesRouter.get("/get-fare", authMiddleware, GetFare);
ridesRouter.post("/create-ride", authMiddleware, createRide)



export default ridesRouter