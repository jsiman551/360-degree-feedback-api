import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface CustomError extends Error {
    statusCode?: number;
}

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
        if (error.code === 11000) {
            // Duplicate User Error
            const customError: CustomError = new Error('Name was already taken, please write a different name');
            customError.statusCode = 409;
            return next(customError);
        }
        next(error);
    }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { username, password } = req.body;

        // Find user in DB
        const user = await User.findOne({ username });
        if (!user) {
            const customError: CustomError = new Error('Invalid Credentials');
            customError.statusCode = 401;
            return next(customError);
        }

        // Compare Passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const customError: CustomError = new Error('Invalid Credentials');
            customError.statusCode = 401;
            return next(customError);
        }

        // Generate JWT
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, {
            expiresIn: '1h', // el token expirará en 1 hora
        });

        // Return token a user data
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
