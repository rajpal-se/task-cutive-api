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
    try {
        const { userId } = req.query;

        if (!(await ensureUserExists(userId!, res))) return;

        const query: any = { userId };

        const result = await TasksSchema.find(query);
        const tasks = result?.map((v) => v?.getData());
        const data = {
            tasks,
        };
        success(res, data);
    } catch (e: any) {
        error(res, e?.message || 'Failed to fetch task', 500);
    }
}

export async function getTaskById(req: GetTaskByIdRequest, res: Response): Promise<void> {
    try {
        const { taskId } = req.params;
        const { userId } = req.query;

        if (!(await ensureUserExists(userId!, res))) return;

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
    try {
        const { taskId } = req.params;
        const { userId } = req.query;
        const { title, description, is_high_priority, is_completed, due_datetime } = req.body;

        if (!(await ensureUserExists(userId!, res))) return;

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
        const { userId } = req.query;

        if (!(await ensureUserExists(userId!, res))) return;

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
