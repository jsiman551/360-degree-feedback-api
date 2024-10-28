import express from 'express';
import { registerUser } from '../controllers/authController';
import validateResource from '../middlewares/validateResource';
import { createUserSchema } from '../schemas/userSchema';

const router = express.Router();

// register user route
router.post('/register', validateResource(createUserSchema), registerUser);

export default router;
