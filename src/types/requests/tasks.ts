import { Request } from 'express';

export interface CreateTaskRequest extends Request {
    body: {
        title: string;
        description: string;
        isHighPriority?: boolean | string | number;
        dueDatetime?: string | Date;
    };
}

export interface UpdateTaskRequest extends Request {
    body: {
        title?: string;
        description?: string;
        isHighPriority?: boolean | string | number;
        isCompleted?: boolean | string | number;
        dueDatetime?: string | Date;
    };
    params: {
        taskId: string;
    };
}

export interface TaskFilterRequest {
    filter?: 'done' | 'pending' | 'expired' | 'recent' | 'upcoming';
    page?: number;
    perPage?: number;
}

export interface TaskListRequest {
    page?: number;
    perPage?: number;
    filter?: string;
}

export interface DeleteTaskRequest extends Request {
    params: {
        taskId: string;
    };
}

export interface GetTaskByIdRequest extends Request {
    params: {
        taskId: string;
    };
}
