import { Request, Response } from 'express';

export const errorHandler = async (err: Error, req: Request, res: Response): Promise<any> => {
    console.error(err.stack);
    return res.status(500).send('Something broke!');
};