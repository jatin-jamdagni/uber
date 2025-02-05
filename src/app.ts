import dotenv from "dotenv"
dotenv.config();

import express, { Request, Response, urlencoded } from 'express';
import cors from "cors"
import { prismaMiddleware } from "./middleware/prismaMiddleware";
import userRouter from "./routes/user.routes";
const app = express();

app.use(cors());
app.use(express.json())
app.use(prismaMiddleware)
app.use(urlencoded({extended: true}))


app.get('/', (req: Request, res: Response) => {
   res.send(`Hello world!`);
});
app.use("/api/v1/user", userRouter);
 


export default app;