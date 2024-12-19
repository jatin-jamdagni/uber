import express from "express";
import cors from "cors";
import dotenv from "dotenv"; // Import dotenv

dotenv.config(); // Initialize dotenv to load environment variables

const app = express();

app.use(cors());

app.get("/", (req, res) => {
    res.json({
        message: "Welcome Back!"
    });
});

export default app;
