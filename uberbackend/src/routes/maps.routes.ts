import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { getCoordinates, getDistanceTime, getSuggestions } from "../controllers/maps.controller";


const mapsRouter = Router();

mapsRouter.get("/get-coordinates", authMiddleware, getCoordinates);
mapsRouter.get("/get-distance-time", authMiddleware, getDistanceTime);
mapsRouter.get("/get-suggestions", authMiddleware, getSuggestions)

export default mapsRouter;