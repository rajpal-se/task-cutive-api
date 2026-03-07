import { Response } from 'express';
import {
    CreateUserRequest,
    DeleteUserRequest,
    GetAllUsersRequest,
    GetUserRequest,
    UpdateUserRequest,
} from '../types/index.js';
import { error, success } from '../utils/index.js';
import UsersSchema from '../models/users.schema.js';

export async function createUser(req: CreateUserRequest, res: Response): Promise<void> {
    const { firstName, lastName, email, password } = req.body;
    const data = { firstName, lastName, email, password };

    try {
        const result = await UsersSchema.create(data);
        const user = result.getData();

        success(res, { data: user, message: 'User created successfully' }, 201);
    } catch (e: any) {
        if (e?.code === 11000 && e?.keyPattern?.email) {
            error(res, 'Email already exists. Please use a different email.', 400);
        } else {
            error(res, e?.message || 'Failed to create user', 500);
        }
    }
}

export async function getUser(req: GetUserRequest, res: Response): Promise<void> {
    try {
        const id = req.query.id;
        const result = await UsersSchema.findById(id);
        const user = result?.getData();
        success(res, user);
    } catch (e: any) {
        error(res, e?.message || 'Failed to fetch user', 500);
    }
}

export async function updateUser(req: UpdateUserRequest, res: Response): Promise<void> {
    try {
        const { id } = req.query;
        const { firstName, lastName } = req.body;
        await UsersSchema.updateOne(
            { _id: id },
            { ...(firstName && { firstName }), ...(lastName && { lastName }) },
        );

        const user = (await UsersSchema.findById(id))?.getData();
        success(res, user);
    } catch (e: any) {
        error(res, e?.message || 'Failed to update user', 500);
    }
}

export async function deleteUser(req: DeleteUserRequest, res: Response): Promise<void> {
    try {
        const { id } = req.query;
        const result = await UsersSchema.findOneAndDelete({ _id: id });
        const user = result?.getData();
        const message = user ? 'User deleted successfully!' : 'User not found.';
        success(res, { data: user, message });
    } catch (e: any) {
        error(res, e?.message || 'Failed to delete user', 500);
    }
}

export async function getAllUsers(req: GetAllUsersRequest, res: Response): Promise<void> {
    res.send('Get All users');
}
