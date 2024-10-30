import Evaluation from '../models/evaluation';
import User from '../models/user';

interface CreateEvaluationParams {
    employeeId: string;
    evaluatorId: string;
    score: number;
    comments?: string;
}

interface UpdateEvaluationParams {
    score?: number;
    comments?: string;
}

export const createEvaluation = async ({
    employeeId,
    evaluatorId,
    score,
    comments,
}: CreateEvaluationParams) => {
    // Check if employee exists
    const employeeExists = await User.findById(employeeId);
    if (!employeeExists) {
        throw new Error('Employee not found');
    }

    // Check for existing evaluation
    const existingEvaluation = await Evaluation.findOne({
        employee: employeeId,
        evaluator: evaluatorId,
    });
    if (existingEvaluation) {
        throw new Error('Evaluation already exists for this employee by the current evaluator');
    }

    const newEvaluation = new Evaluation({
        employee: employeeId,
        evaluator: evaluatorId,
        score,
        comments,
    });

    await newEvaluation.save();
    return newEvaluation;
};

export const getEvaluationById = async (id: string, userId: string, userRole: string) => {
    const evaluation = await Evaluation.findById(id).populate('employee evaluator');

    if (!evaluation) {
        throw new Error('Evaluation not found');
    }

    // Logic by role
    if (userRole === 'Admin') {
        return evaluation;
    }

    if (userRole === 'Manager') {
        const evaluator = await User.findById(evaluation.evaluator);
        if (evaluator && evaluator.role === 'Admin') {
            throw new Error('Access denied: you cannot view this evaluation');
        }
        return evaluation;
    }

    if (userRole === 'Employee') {
        if (evaluation.employee._id.toString() !== userId) {
            throw new Error('Access denied: you cannot view this evaluation');
        }
        return evaluation;
    }

    throw new Error('Access denied: invalid role');
};

export const updateEvaluation = async (id: string, { score, comments }: UpdateEvaluationParams, userId: string) => {
    const evaluation = await Evaluation.findById(id).populate('evaluator');

    if (!evaluation) {
        throw new Error('Evaluation not found');
    }

    if (evaluation.evaluator._id.toString() !== userId) {
        throw new Error('Access denied: you are not authorized to update this evaluation');
    }

    if (score !== undefined) evaluation.score = score;
    if (comments) evaluation.comments = comments;

    await evaluation.save();
    return evaluation;
};

export const getEvaluationsByEmployeeId = async (employeeId: string, role: string, userId: string) => {
    // Verify if employee exists
    const employeeExists = await User.findById(employeeId);
    if (!employeeExists) {
        throw new Error('Employee not found');
    }

    let evaluations;

    if (role === 'Admin') {
        evaluations = await Evaluation.find({ employee: employeeId }).populate('evaluator employee');
    } else if (role === 'Manager') {
        const admins = await User.find({ role: 'Admin' }, '_id');
        const adminIds = admins.map(admin => admin._id);

        evaluations = await Evaluation.find({
            employee: employeeId,
            evaluator: { $nin: adminIds },
        }).populate('evaluator employee');
    } else if (role === 'Employee') {
        if (userId !== employeeId) {
            throw new Error('Access denied');
        }

        evaluations = await Evaluation.find({
            employee: employeeId,
            evaluator: { $nin: await User.find({ role: 'Admin' }, '_id') }
        }).populate('evaluator employee');
    } else {
        throw new Error('Access denied: invalid role');
    }

    return evaluations;
};
