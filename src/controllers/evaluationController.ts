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
            error.statusCode = 404;
            return next(error);
        }

        const existingEvaluation = await Evaluation.findOne({
            employee: employeeId,
            evaluator: req.user.id,
        });

        if (existingEvaluation) {
            const error: CustomError = new Error('Evaluation already exists for this employee by the current evaluator');
            error.statusCode = 400;
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


export const getEvaluationById = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) {
            const error: CustomError = new Error('Unauthorized: user information missing');
            error.statusCode = 401;
            return next(error);
        }

        const { id } = req.params;

        // search evaluation in DB
        const evaluation = await Evaluation.findById(id).populate('employee evaluator');

        if (!evaluation) {
            const error: CustomError = new Error('Evaluation not found');
            error.statusCode = 404;
            return next(error);
        }

        // Logic by role
        if (req.user.role === 'Admin') {
            // admins can see all evaluations
            res.status(200).json({
                success: true,
                data: evaluation,
            });
            return;
        }

        if (req.user.role === 'Manager') {
            // Managers can see only their own evaluations
            if (evaluation.evaluator.toString() !== req.user.id) {
                const error: CustomError = new Error('Access denied: you cannot view this evaluation');
                error.statusCode = 403;
                return next(error);
            }
            res.status(200).json({
                success: true,
                data: evaluation,
            });
            return;
        }

        if (req.user.role === 'Employee') {
            // Employees can see the evalution made to them
            if (evaluation.employee.toString() !== req.user.id) {
                const error: CustomError = new Error('Access denied: you cannot view this evaluation');
                error.statusCode = 403;
                return next(error);
            }
            res.status(200).json({
                success: true,
                data: evaluation,
            });
            return;
        }

        // role is not known
        const error: CustomError = new Error('Access denied: invalid role');
        error.statusCode = 403;
        return next(error);
    } catch (error) {
        next(error);
    }
};

export const updateEvaluation = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) {
            const error: CustomError = new Error('Unauthorized: user information missing');
            error.statusCode = 401;
            return next(error);
        }

        const { id } = req.params;
        const { score, comments } = req.body;

        // find evaluation in DB
        const evaluation = await Evaluation.findById(id);

        if (!evaluation) {
            const error: CustomError = new Error('Evaluation not found');
            error.statusCode = 404;
            return next(error);
        }

        // Verify if user owns evaluation
        if (evaluation.evaluator.toString() !== req.user.id) {
            const error: CustomError = new Error('Access denied: you can only update your own evaluations');
            error.statusCode = 403;
            return next(error);
        }

        // update evaluation
        if (score !== undefined) evaluation.score = score;
        if (comments) evaluation.comments = comments;

        await evaluation.save();

        res.status(200).json({
            success: true,
            message: 'Evaluation updated successfully',
            data: evaluation,
        });
    } catch (error) {
        next(error);
    }
};


export const getEvaluationsByEmployeeId = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id: employeeId } = req.params;

        // Verify if employee exists
        const employeeExists = await User.findById(employeeId);
        if (!employeeExists) {
            const error: CustomError = new Error('Employee not found');
            error.statusCode = 404;
            return next(error);
        }

        let evaluations;

        if (req.user?.role === 'Admin') {
            // Admins can look at all evaluations by all users
            evaluations = await Evaluation.find({ employee: employeeId }).populate('evaluator employee');
        } else if (req.user?.role === 'Manager') {
            // exclude all admins evaluations
            const admins = await User.find({ role: 'Admin' }, '_id');
            const adminIds = admins.map(admin => admin._id);

            // managers can only look at managers evaluations
            evaluations = await Evaluation.find({
                employee: employeeId,
                evaluator: { $nin: adminIds }, // Excluir evaluaciones hechas por administradores
            }).populate('evaluator employee');
        } else if (req.user?.role === 'Employee') {
            // Employee can only look at it's own evaluations
            if (req.user.id !== employeeId) {
                const error: CustomError = new Error('Access denied');
                error.statusCode = 403;
                return next(error);
            }
            evaluations = await Evaluation.find({ employee: employeeId }).populate('evaluator employee');
        } else {
            const error: CustomError = new Error('Access denied: invalid role');
            error.statusCode = 403;
            return next(error);
        }

        res.status(200).json({
            success: true,
            data: evaluations,
        });
    } catch (error) {
        next(error);
    }
};
