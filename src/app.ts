import express, { Application } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';

dotenv.config();

const app: Application = express();
connectDB();

app.use(express.json());

// test route to verify if server works
app.get('/', (req, res) => {
    res.send('API is working');
});

export default app;
