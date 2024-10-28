import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { username, password, role } = req.body;

        const newUser = new User({ username, password, role });
        await newUser.save();

        res.status(201).json({
            success: true,
            message: 'User was created successfully',
            data: {
                id: newUser._id,
                username: newUser.username,
                role: newUser.role,
            },
        });
    } catch (error: any) {
        // if user already exist
        if (error.code === 11000) {
            res.status(409).json({
                success: false,
                status: 409,
                message: 'Name was already taken, please write a different name',
            });
        } else {
            next(error);
        }
    }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { username, password } = req.body;

        // Look for user in DB
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Credentials',
            });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Credentials',
            });
        }

        // Generate JWT
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, {
            expiresIn: '1h', // token will expire in 1 hour
        });

        // Return token and user data
        res.status(200).json({
            success: true,
            message: 'Login Successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
            },
        });
    } catch (error) {
        next(error);
    }
};
