import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { GetFare } from "../controllers/rides.controller";


const ridesRouter = Router();



ridesRouter.post("/get-fare", authMiddleware, GetFare);
ridesRouter.post("/create-ride", authMiddleware,)



export default ridesRouter