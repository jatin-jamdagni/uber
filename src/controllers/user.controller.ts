import { Request, Response, NextFunction } from "express";
import { userRegisterValidator, userSigninValidator } from "../validator/user.validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const userRegisterController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = userRegisterValidator.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({ error: result.error.issues });
        }

        const validatedData = result.data;
        const existUser = await req.prisma.user.findFirst({ where: { email: validatedData.email } });

        if (existUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        validatedData.password = await bcrypt.hash(validatedData.password, 10);

        await req.prisma.user.create({ data: validatedData });

        return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        next(error); // Pass errors to Express error handler
    }
};

export const userSigninController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = userSigninValidator.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({ error: result.error.issues });
        }

        const validatedData = result.data;
        const userExist = await req.prisma.user.findUnique({ where: { email: validatedData.email } });

        if (!userExist) {
            return res.status(401).json({ error: "User does not exist" });
        }

        const isPasswordValid = await bcrypt.compare(validatedData.password, userExist.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign({ id: userExist.id }, process.env.JWT_SECRET!, { expiresIn: "7d" });
        const { password, id, ...user } = userExist;

        return res.status(200).json({ message: "User signed in successfully", user, token });
    } catch (error) {
        next(error);
    }
};
