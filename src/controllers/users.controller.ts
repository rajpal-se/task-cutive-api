import { Response } from 'express';
import {
    CreateUserRequest,
    DeleteUserRequest,
    GetAllUsersRequest,
    GetUserRequest,
    UpdateUserRequest,
} from '../types/index.js';

export async function createUser(req: CreateUserRequest, res: Response): Promise<void> {
    res.send('Create a new user');
}

export async function getUser(req: GetUserRequest, res: Response): Promise<void> {
    res.send('Get user profile');
}

export async function updateUser(req: UpdateUserRequest, res: Response): Promise<void> {
    res.send('Update user profile');
}

export async function deleteUser(req: DeleteUserRequest, res: Response): Promise<void> {
    res.send('Delete user profile');
}

export async function getAllUsers(req: GetAllUsersRequest, res: Response): Promise<void> {
    res.send('Get All users');
}
