import dotenv from "dotenv"
dotenv.config();

import express, { Request, Response, urlencoded } from 'express';
import cors from "cors"
import { prismaMiddleware } from "./middleware/prismaMiddleware";
import userRouter from "./routes/user.routes";
import { errorHandler } from "./middleware/errorHandler";
import cookieParser from 'cookie-parser'

const app = express();

app.use(cors());
app.use(express.json())
app.use(prismaMiddleware)
app.use(urlencoded({ extended: true }))
app.use(cookieParser());



app.get('/', (req: Request, res: Response) => {
   res.send(`Hello world!`);
});
app.use("/api/v1/user", userRouter);


app.use(errorHandler);

app.use((req: Request, res: Response) => {
   res.status(404).send('Not Found');
});
export default app;