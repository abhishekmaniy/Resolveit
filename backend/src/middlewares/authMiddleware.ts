import jwt, { decode } from 'jsonwebtoken';
import User from '../models/User';
import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();


const JWT_SECRET = process.env.JWT_SECRET || 'yoursecretkey';

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}


export const protect = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Not authenticated' });

    try {
        console.log(JWT_SECRET)
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log(decoded)
        const userId = typeof decoded === 'object' && 'userId' in decoded ? (decoded as any).userId : undefined;
        if (!userId) return res.status(401).json({ message: 'Invalid token payload' });
        req.user = await User.findById(userId).select('-password');
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};