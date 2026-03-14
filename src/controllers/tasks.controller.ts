import { Response } from 'express';
import {
    CreateTaskRequest,
    UpdateTaskRequest,
    DeleteTaskRequest,
    GetTaskByIdRequest,
    GetAllTasksRequest,
} from '../types/index.js';
import { error, success } from '../utils/app.js';
import usersSchema from '../models/users.schema.js';
import TasksSchema from '../models/tasks.schema.js';

function getAuthenticatedUserId(req: { auth?: { sub: string } }, res: Response): string | null {
    const userId = req.auth?.sub;

    if (!userId) {
        error(res, 'Authenticated user context is required', 401);
        return null;
    }

    return userId;
}

export async function ensureUserExists(userId: string, res: Response): Promise<boolean> {
    const userExists = await usersSchema.exists({ _id: userId });
    if (!userExists) {
        error(res, 'User not found', 404);
        return false;
    }
    return true;
}

export async function getAllTasks(req: GetAllTasksRequest, res: Response): Promise<void> {
    try {
        const userId = getAuthenticatedUserId(req, res);
        if (!userId) return;

        const { filter } = req.query;
        const page = Number(req.query.page);
        const perPage = Math.min(Number(req.query.perPage) || 10, 100);

        if (!(await ensureUserExists(userId, res))) return;

        const now = new Date();
        const query: Record<string, unknown> = { userId };
        const sort: Record<string, 1 | -1> = { created_at: -1 };

        switch (filter) {
            case 'done':
                query.is_completed = true;
                break;
            case 'pending':
                query.is_completed = false;
                break;
            case 'expired':
                query.is_completed = false;
                query.due_datetime = { $lt: now };
                sort.due_datetime = 1;
                delete sort.created_at;
                break;
            case 'upcoming':
                query.is_completed = false;
                query.due_datetime = { $gte: now };
                sort.due_datetime = 1;
                delete sort.created_at;
                break;
            case 'recent':
            default:
                break;
        }

        const total = await TasksSchema.countDocuments(query);
        const result = await TasksSchema.find(query)
            .sort(sort)
            .skip((page - 1) * perPage)
            .limit(perPage);

        const tasks = result?.map((v) => v?.getData());
        const data = {
            tasks,
            pagination: {
                total,
                page,
                perPage,
                totalPages: Math.ceil(total / perPage) || 1,
            },
        };
        success(res, data);
    } catch (e: any) {
        error(res, e?.message || 'Failed to fetch all tasks', 500);
    }
}

export async function getTaskById(req: GetTaskByIdRequest, res: Response): Promise<void> {
    try {
        const { taskId } = req.params;
        const userId = getAuthenticatedUserId(req, res);
        if (!userId) return;

        if (!(await ensureUserExists(userId, res))) return;

        const result = await TasksSchema.findOne({ _id: taskId, userId });
        const task = result?.getData();
        if (!task) {
            error(res, 'Task not found', 404);
            return;
        }

        success(res, task);
    } catch (e: any) {
        error(res, e?.message || 'Failed to fetch task', 500);
    }
}

export async function createTask(req: CreateTaskRequest, res: Response): Promise<void> {
    try {
        const userId = getAuthenticatedUserId(req, res);
        if (!userId) return;

        const { title, description, isHighPriority, dueDatetime } = req.body;

        if (!(await ensureUserExists(userId, res))) return;

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
    try {
        const { taskId } = req.params;
        const userId = getAuthenticatedUserId(req, res);
        if (!userId) return;

        const { title, description, is_high_priority, is_completed, due_datetime } = req.body;

        if (!(await ensureUserExists(userId, res))) return;

        const task = await TasksSchema.findOne({ _id: taskId, userId });
        if (!task) {
            error(res, 'Task not found', 404);
            return;
        }

        if (title) task.title = title;
        if (description) task.description = description;
        if (is_high_priority !== undefined) task.is_high_priority = is_high_priority;
        if (due_datetime) task.due_datetime = due_datetime as Date;
        if (is_completed !== undefined) task.is_completed = is_completed;

        const result = await task.save();

        success(res, { data: result, message: 'Task updated successfully' });
    } catch (e: any) {
        error(res, e?.message || 'Failed to update task', 500);
    }
}

export async function deleteTask(req: DeleteTaskRequest, res: Response): Promise<void> {
    try {
        const { taskId } = req.params;
        const userId = getAuthenticatedUserId(req, res);
        if (!userId) return;

        if (!(await ensureUserExists(userId, res))) return;

        const result = await TasksSchema.findOneAndDelete({ _id: taskId, userId });
        const task = result?.getData();
        if (!task) {
            error(res, 'Task not found', 404);
            return;
        }

        success(res, { data: task, message: 'Task deleted successfully!' });
    } catch (e: any) {
        error(res, e?.message || 'Failed to delete task', 500);
    }
}
