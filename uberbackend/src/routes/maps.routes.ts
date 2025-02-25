import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { getCoordinates } from "../controllers/maps.controller";


const mapsRouter = Router();

mapsRouter.get("/get-coordinates", authMiddleware, getCoordinates)

export default mapsRouter;