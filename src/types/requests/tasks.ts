import { Request } from 'express';

export interface TaskFilterRequest {
    filter?: 'done' | 'pending' | 'expired' | 'recent' | 'upcoming';
    page?: string;
    perPage?: string;
}

export interface CreateTaskRequest extends Request {
    body: {
        title: string;
        description: string;
        isHighPriority?: boolean;
        dueDatetime?: string | Date;
    };
}

export interface GetAllTasksRequest extends Request {
    query: {
        filter?: TaskFilterRequest['filter'];
        page?: string;
        perPage?: string;
    };
}

export interface UpdateTaskRequest extends Request {
    body: {
        title?: string;
        description?: string;
        is_high_priority?: boolean;
        is_completed?: boolean;
        due_datetime?: string | Date;
    };
    params: {
        taskId: string;
    };
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
