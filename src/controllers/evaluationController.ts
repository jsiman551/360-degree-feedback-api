import { Request, Response, NextFunction } from 'express';
import * as evaluationService from '../services/evaluationService';

interface CustomRequest extends Request {
    user?: {
        id: string;
        role: 'Admin' | 'Manager' | 'Employee';
    };
}

export const createEvaluation = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) {
            const error: Error = new Error('Unauthorized: user information missing');
            return next(error);
        }

        const { employeeId, score, comments } = req.body;

        const newEvaluation = await evaluationService.createEvaluation({
            employeeId,
            evaluatorId: req.user.id,
            score,
            comments,
        });

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
            return next(new Error('Unauthorized: user information missing'));
        }

        const { id } = req.params;
        const evaluation = await evaluationService.getEvaluationById(id, req.user.id, req.user.role);

        res.status(200).json({
            success: true,
            data: evaluation,
        });
    } catch (error) {
        next(error);
    }
};

export const updateEvaluation = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {

        if (!req.user) {
            const error: Error = new Error('Unauthorized: user information missing');
            return next(error);
        }

        const { id } = req.params;
        const { score, comments } = req.body;

        const updatedEvaluation = await evaluationService.updateEvaluation(id, { score, comments }, req.user.id);

        res.status(200).json({
            success: true,
            data: updatedEvaluation,
        });
    } catch (error) {
        next(error);
    }
};

export const getEvaluationsByEmployeeId = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {

        if (!req.user) {
            const error: Error = new Error('Unauthorized: user information missing');
            return next(error);
        }

        const { id: employeeId } = req.params;

        const evaluations = await evaluationService.getEvaluationsByEmployeeId(employeeId, req.user?.role, req.user?.id);

        res.status(200).json({
            success: true,
            data: evaluations,
        });
    } catch (error) {
        next(error);
    }
};
