import express, { Application } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import errorHandler from './middlewares/errorHandler';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app: Application = express();
connectDB();

app.use(express.json());

// routes
app.use('/api/auth', userRoutes);

// Error Handler Middleware
app.use(errorHandler);

export default app;