import express, { Application, Router } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import errorHandler from './middlewares/errorHandler';
import userRoutes from './routes/userRoutes';
import employeeRoutes from './routes/employeeRoutes';
import evaluationRoutes from './routes/evaluationRoutes';
import feedbackRoutes from './routes/feedbackRoutes';

dotenv.config();

const app: Application = express();
connectDB();

app.use(cors({ origin: '*' }));
app.use(express.json());

// routes
const apiRouter = Router();

apiRouter.use('/auth', userRoutes);
apiRouter.use(employeeRoutes);
apiRouter.use(evaluationRoutes);
apiRouter.use(feedbackRoutes);

app.use('/api', apiRouter);

// Error Handler Middleware
app.use(errorHandler);

export default app;
