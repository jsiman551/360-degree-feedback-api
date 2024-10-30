import User, { IUser } from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { MongoError } from 'mongodb';

interface RegisterUserInput {
    username: string;
    email: string;
    password: string;
    role: 'Admin' | 'Manager' | 'Employee';
}

interface LoginUserInput {
    username: string;
    password: string;
}

export const registerUser = async (data: RegisterUserInput): Promise<IUser> => {
    const { username, email, password, role } = data;

    // Verify if email exists
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
        throw new Error('Email already in use');
    }

    try {
        // Create and save user
        const newUser = new User({ username, email, password, role });
        await newUser.save();
        return newUser;
    } catch (error) {
        // Check if is duplicated username
        if (error instanceof MongoError && error.code === 11000) {
            throw new Error('Username already in use');
        }

        throw error; // other errors
    }
};

export const loginUser = async (data: LoginUserInput): Promise<{ token: string; user: IUser }> => {
    const { username, password } = data;

    // Search user by username
    const user = await User.findOne({ username });
    if (!user) {
        throw new Error('Invalid Credentials');
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid Credentials');
    }

    // Generate JWT
    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: '1h' }
    );

    return { token, user };
};
