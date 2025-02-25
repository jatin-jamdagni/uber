import dotenv from "dotenv"
dotenv.config();

import express, { Request, Response, urlencoded } from 'express';
import cors from "cors"
import { requestOverloaderMiddleware } from "./middleware/requestOverloaderMiddleware";
import userRouter from "./routes/user.routes";
import { errorHandler } from "./middleware/errorHandler";
import cookieParser from 'cookie-parser'
import captainRouter from "./routes/captain.routes";
import mapsRouter from "./routes/maps.routes";

const app = express();

app.use(cors());
app.use(express.json())
app.use(requestOverloaderMiddleware);
app.use(urlencoded({ extended: true }))
app.use(cookieParser());



app.get('/', (req: Request, res: Response) => {
   res.send(`Hello world!`);
});
app.use("/api/v1/user", userRouter);
app.use("/api/v1/captain", captainRouter);
app.use("/api/v1/maps", mapsRouter);


app.use(errorHandler);

app.use((req: Request, res: Response) => {
   res.status(404).send('Not Found');
});
export default app;