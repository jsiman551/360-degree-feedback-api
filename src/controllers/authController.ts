import { Request, Response, NextFunction } from 'express';
import User from '../models/user';

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
