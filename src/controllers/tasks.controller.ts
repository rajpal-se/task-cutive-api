import { Response } from 'express';
import {
    CreateTaskRequest,
    UpdateTaskRequest,
    DeleteTaskRequest,
    GetTaskByIdRequest,
} from '../types/index.js';

export async function getAllTasks(req: CreateTaskRequest, res: Response): Promise<void> {
    res.send('Get all tasks');
}

export async function getTaskById(req: GetTaskByIdRequest, res: Response): Promise<void> {
    res.send('Get task by ID');
}

export async function createTask(req: CreateTaskRequest, res: Response): Promise<void> {
    res.send('Create a new task');
}

export async function updateTask(req: UpdateTaskRequest, res: Response): Promise<void> {
    res.send('Update task');
}

export async function deleteTask(req: DeleteTaskRequest, res: Response): Promise<void> {
    res.send('Delete task');
}
