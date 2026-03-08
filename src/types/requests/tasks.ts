import { Request } from 'express';

interface TaskOwnerQuery {
    userId: string;
}

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
    query: Partial<TaskOwnerQuery>;
}

export interface GetAllTasksRequest extends Request {
    query: Partial<
        TaskOwnerQuery & {
            filter?: TaskFilterRequest['filter'];
            page?: string;
            perPage?: string;
        }
    >;
}

export interface UpdateTaskRequest extends Request {
    body: {
        title?: string;
        description?: string;
        isHighPriority?: boolean;
        isCompleted?: boolean;
        dueDatetime?: string | Date;
    };
    params: {
        taskId: string;
    };
    query: Partial<TaskOwnerQuery>;
}

export interface DeleteTaskRequest extends Request {
    params: {
        taskId: string;
    };
    query: Partial<TaskOwnerQuery>;
}

export interface GetTaskByIdRequest extends Request {
    params: {
        taskId: string;
    };
    query: Partial<TaskOwnerQuery>;
}
