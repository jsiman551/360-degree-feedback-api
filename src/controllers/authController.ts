import { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser } from '../services/authService';

export const registerUserController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const newUser = await registerUser(req.body);

        res.status(201).json({
            success: true,
            message: 'User was created successfully',
            data: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const loginUserController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { token, user } = await loginUser(req.body);

        res.status(200).json({
            success: true,
            message: 'Login Successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        next(error);
    }
};
