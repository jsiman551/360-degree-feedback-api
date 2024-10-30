import Evaluation, { IEvaluation } from '../models/evaluation';
import User, { IUser } from '../models/user';
import { IEmployeeReport } from '../controllers/employeeController';

// type for populated evaluations
interface IPopulatedEvaluation extends Omit<IEvaluation, 'evaluator'> {
    evaluator: {
        username: string;
    };
}

export const getAllEmployees = async (userRole: string): Promise<IUser[]> => {
    if (userRole === 'Admin') {
        return await User.find({}).select('-password');
    } else if (userRole === 'Manager') {
        return await User.find({ role: { $nin: ['Admin', 'Manager'] } }).select('-password');
    } else {
        throw new Error('Access denied');
    }
};

export const getEmployeeById = async (id: string): Promise<IUser | null> => {
    return await User.findById(id);
};

export const getEmployeeEvaluations = async (id: string, userId: string, userRole: string): Promise<IPopulatedEvaluation[]> => {
    let evaluations;

    if (userRole === 'Admin') {
        evaluations = await Evaluation.find({ employee: id })
            .populate<{ evaluator: { username: string } }>('evaluator', 'username');
    } else if (userRole === 'Manager') {
        const managerIds = await User.find({ role: 'Manager' }).select('_id');
        evaluations = await Evaluation.find({ employee: id, evaluator: { $in: managerIds } })
            .populate<{ evaluator: { username: string } }>('evaluator', 'username');
    } else if (userRole === 'Employee') {
        if (id !== userId) {
            throw new Error('Access denied');
        }
        const managerIds = await User.find({ role: 'Manager' }).select('_id');
        evaluations = await Evaluation.find({ employee: id, evaluator: { $in: managerIds } })
            .populate<{ evaluator: { username: string } }>('evaluator', 'username');
    } else {
        throw new Error('Access denied');
    }

    return evaluations as IPopulatedEvaluation[];
};

export const generateEmployeeReport = async (employee: IUser, evaluations: IPopulatedEvaluation[]): Promise<IEmployeeReport> => {
    const averageScore = evaluations.length > 0
        ? evaluations.reduce((acc, evaluation) => acc + evaluation.score, 0) / evaluations.length
        : 0;

    const report: IEmployeeReport = {
        employeeId: employee.id,
        username: employee.username,
        evaluations: evaluations.map(evaluation => ({
            date: evaluation.date,
            score: evaluation.score,
            comments: evaluation.comments,
            evaluator: evaluation.evaluator.username,
        })),
        averageScore: averageScore,
    };

    return report;
};
