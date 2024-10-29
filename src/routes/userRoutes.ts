import express from 'express';
import { loginUser, registerUser } from '../controllers/authController';
import validateResource from '../middlewares/validateResource';
import { createUserSchema, loginUserSchema } from '../schemas/userSchema';
import { authorizeRoles } from '../middlewares/authMiddleware';

const router = express.Router();

// register user route
router.post(
    '/register',
    authorizeRoles(['Admin']),
    validateResource(createUserSchema),
    registerUser
);

// login route
router.post('/login', validateResource(loginUserSchema), loginUser);

export default router;
