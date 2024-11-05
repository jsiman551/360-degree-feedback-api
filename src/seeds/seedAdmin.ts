import User, { IUser } from '../models/user';
import { CustomError } from '../middlewares/errorHandler';

const seedAdmin = async (): Promise<void> => {
    try {
        const existingAdmin = await User.findOne({ username: 'admin' });

        if (!existingAdmin) {
            const adminUser: Partial<IUser> = {
                username: 'admin',
                email: 'josesimancas51@gmail.com',
                password: 'Admin123',
                role: 'Admin',
                createdAt: new Date(),
            };

            await User.create(adminUser);
            console.log('Admin user seeded successfully');
        } else {
            console.log('Admin user already exists');
        }
    } catch (error: any) {
        const customError: CustomError = new Error('Error seeding admin user');
        customError.statusCode = 500;
        customError.errors = [{ path: 'seedAdmin', message: error.message }];
        throw customError;
    }
};

export default seedAdmin;
