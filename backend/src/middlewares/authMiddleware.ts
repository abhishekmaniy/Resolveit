import jwt from 'jsonwebtoken';
import User from '../models/User';
import { NextFunction, Request, Response } from 'express';

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
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        const userId = typeof decoded === 'object' && 'id' in decoded ? (decoded as any).id : undefined;
        if (!userId) return res.status(401).json({ message: 'Invalid token payload' });
        req.user = await User.findById(userId).select('-password');
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};