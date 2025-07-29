import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Complaint from '../models/Complaint.js';

const JWT_SECRET = process.env.JWT_SECRET || 'yoursecretkey';
const COOKIE_NAME = 'token';

// Register new user
export const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'User'
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        res.status(500).json({ message: 'Error registering user', error: errorMessage });
    }
};

// Login
export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid email or password' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Set cookie
        res.cookie(COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                role: user.role,
                email: user.email
            }
        });
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        res.status(500).json({ message: 'Error logging in', error: errorMessage });
    }
};


export const verifyUser = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        console.log(token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        const userId = typeof decoded === 'object' && 'userId' in decoded ? (decoded as any).userId : null;
        if (!userId) {
            return res.status(401).json({ message: 'Invalid token payload' });
        }
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Populate complaints (assuming `Complaint` model has userId)
        const complaints = await Complaint.find({ userId: user._id });

        res.status(200).json({ user: { ...user.toObject(), complaints } });
    } catch (err) {
        console.error('Verify error:', err);
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};


// Logout (clears cookie)
export const logoutUser = (req: Request, res: Response) => {
    res.clearCookie(COOKIE_NAME);
    res.status(200).json({ message: 'Logged out successfully' });
};
