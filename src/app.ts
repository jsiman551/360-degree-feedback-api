import express, { Application, Router } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import errorHandler from './middlewares/errorHandler';
import userRoutes from './routes/userRoutes';
import employeeRoutes from './routes/employeeRoutes';
import evaluationRoutes from './routes/evaluationRoutes';
import feedbackRoutes from './routes/feedbackRoutes';
import seedAdmin from './seeds/seedAdmin';

dotenv.config();

const app: Application = express();

const initializeApp = async () => {
    //set database
    await connectDB();
    await seedAdmin();

    app.use(cors({ origin: '*' }));
    app.use(express.json());

    //set routes
    const apiRouter = Router();

    apiRouter.use('/auth', userRoutes);
    apiRouter.use(employeeRoutes);
    apiRouter.use(evaluationRoutes);
    apiRouter.use(feedbackRoutes);

    app.use('/api', apiRouter);

    // error handler
    app.use(errorHandler);
};

initializeApp().catch((error) => {
    console.error('Error initializing app:', error);
    process.exit(1);
});

export default app;
