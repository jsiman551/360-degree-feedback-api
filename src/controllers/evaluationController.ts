import { Request, Response, NextFunction } from 'express';
import Evaluation from '../models/evaluation';
import User from '../models/user';
import { CustomError } from '../middlewares/errorHandler';

interface CustomRequest extends Request {
    user?: {
        id: string;
        role: 'Admin' | 'Manager' | 'Employee';
    };
}

export const createEvaluation = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        //check if user data exist
        if (!req.user) {
            const error: CustomError = new Error('Unauthorized: user information missing');
            error.statusCode = 401;
            return next(error);
        }

        // get request data
        const { employeeId, score, comments } = req.body;

        // required data
        if (!employeeId || score === undefined) {
            const error: CustomError = new Error('Employee ID and score are required');
            error.statusCode = 400;
            return next(error);
        }

        // check if employee exists
        const employeeExists = await User.findById(employeeId);
        if (!employeeExists) {
            const error: CustomError = new Error('Employee not found');
            error.statusCode = 404; // Usar 404 para recursos no encontrados
            return next(error);
        }

        // create and save evaluation
        const newEvaluation = new Evaluation({
            employee: employeeId,
            evaluator: req.user.id,
            score,
            comments,
        });

        await newEvaluation.save();

        // success
        res.status(201).json({
            success: true,
            message: 'Evaluation created successfully',
            data: newEvaluation,
        });
    } catch (error) {
        next(error);
    }
};
