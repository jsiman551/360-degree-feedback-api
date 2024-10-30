import express from 'express';
import { loginUserController, registerUserController } from '../controllers/authController';
import validateResource from '../middlewares/validateResource';
import { createUserSchema, loginUserSchema } from '../schemas/userSchema';
import { authorizeRoles } from '../middlewares/authMiddleware';

const router = express.Router();

// register user route
router.post(
    '/register',
    authorizeRoles(['Admin']),
    validateResource(createUserSchema),
    registerUserController
);

// login route
router.post('/login', validateResource(loginUserSchema), loginUserController);

export default router;
