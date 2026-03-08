import { Response } from 'express';
import {
    CreateTaskRequest,
    UpdateTaskRequest,
    DeleteTaskRequest,
    GetTaskByIdRequest,
} from '../types/index.js';
import { error, success } from '../utils/app.js';
import usersSchema from '../models/users.schema.js';
import TasksSchema from '../models/tasks.schema.js';

export async function ensureUserExists(userId: string, res: Response): Promise<boolean> {
    if (!userId) {
        error(res, 'User ID is required', 400);
        return false;
    }
    const userExists = await usersSchema.exists({ _id: userId });
    if (!userExists) {
        error(res, 'User not found', 404);
        return false;
    }
    return true;
}

export async function getAllTasks(req: CreateTaskRequest, res: Response): Promise<void> {
    res.send('Get all tasks');
}

export async function getTaskById(req: GetTaskByIdRequest, res: Response): Promise<void> {
    res.send('Get task by ID');
}

export async function createTask(req: CreateTaskRequest, res: Response): Promise<void> {
    try {
        const { userId } = req.query;
        const { title, description, isHighPriority, dueDatetime } = req.body;

        if (!(await ensureUserExists(userId!, res))) return;

        const dueDate = Date.parse(dueDatetime as string);
        const parsedPriority = isHighPriority || false;

        const task = await TasksSchema.create({
            userId,
            title,
            description,
            is_high_priority: parsedPriority,
            due_datetime: dueDate ? new Date(dueDate) : undefined,
        });

        success(res, { data: task.toObject(), message: 'Task created successfully' }, 201);
    } catch (e: any) {
        error(res, e?.message || 'Failed to create task', 500);
    }
}

export async function updateTask(req: UpdateTaskRequest, res: Response): Promise<void> {
    res.send('Update task');
}

export async function deleteTask(req: DeleteTaskRequest, res: Response): Promise<void> {
    res.send('Delete task');
}
