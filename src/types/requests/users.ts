import { Request } from 'express';

export interface CreateUserRequest extends Request {
    body: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
    };
}

export interface GetUserRequest extends Request {
    query: {
        id: string;
    };
}

export interface UpdateUserRequest extends Request {
    body: {
        firstName?: string;
        lastName?: string;
    };
}

export interface DeleteUserRequest extends Request {}

export interface GetAllUsersRequest extends Request {
    query: {
        page?: string;
        perPage?: string;
    };
}

// Additional requests related to user actions

export interface VerifyEmailRequest extends Request {
    body: {
        otp?: number;
    };
}

export interface ResetUserPasswordRequest extends Request {
    body: {
        oldPassword: string;
        newPassword: string;
    };
}
