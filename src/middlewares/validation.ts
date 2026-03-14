import { NextFunction, Request, Response } from 'express';
import {
    loginRequestSchema,
    refreshAccessTokenRequestSchema,
    resetPasswordRequestSchema,
    verifyOtpRequestSchema,
} from '../validators/auth.js';
import {
    createTaskRequestSchema,
    deleteTaskRequestSchema,
    getAllTasksRequestSchema,
    getTaskByIdRequestSchema,
    updateTaskRequestSchema,
} from '../validators/tasks.js';
import {
    createUserRequestSchema,
    deleteUserRequestSchema,
    getUserRequestSchema,
    updateUserRequestSchema,
} from '../validators/users.js';
import { error } from './../utils/app.js';

const userConfig = {
    POST: [
        [/\/users\/?$/, createUserRequestSchema, ['firstName', 'lastName', 'email', 'password']],
    ],
    GET: [[/\/users\/?$/, getUserRequestSchema]],
    PATCH: [[/\/users\/?$/, updateUserRequestSchema]],
    DELETE: [[/\/users\/?$/, deleteUserRequestSchema]],
};

const taskConfig = {
    POST: [[/\/tasks\/?$/, createTaskRequestSchema]],
    GET: [
        [/\/tasks\/?$/, getAllTasksRequestSchema],
        [/\/tasks\/.+\/?$/, getTaskByIdRequestSchema],
    ],
    PATCH: [[/\/tasks\/.+\/?$/, updateTaskRequestSchema]],
    DELETE: [[/\/tasks\/.+\/?$/, deleteTaskRequestSchema]],
};

const authConfig = {
    POST: [
        [/\/auth\/login\/?$/, loginRequestSchema],
        [/\/auth\/reset-password\/?$/, resetPasswordRequestSchema],
        [/\/auth\/verify-otp\/?$/, verifyOtpRequestSchema],
        [/\/auth\/refresh-access-token\/?$/, refreshAccessTokenRequestSchema],
    ],
};

async function findError(req: Request, route: string, config: any) {
    const path = req.path;
    // console.log(req);
    if (path.startsWith(route)) {
        const matchedConfig = config[req.method as keyof typeof userConfig]?.find((item: any) => {
            return (item[0] as RegExp).test(path);
        });
        if (matchedConfig) {
            try {
                const fieldsOrder = (matchedConfig[2] as string[]) || [];
                if (fieldsOrder.length) {
                    for (const field of fieldsOrder) {
                        await (matchedConfig[1] as any).validateAt(`body.${field}`, req);
                    }
                } else {
                    await (matchedConfig[1] as any).validate(req, {
                        abortEarly: true,
                    });
                }
            } catch (err: any) {
                return err?.message || 'Validation Error.';
            }
        }
    }
}

export async function validateRequestMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const path = req.path;
        const errorMessage = path.startsWith('/users')
            ? await findError(req, '/users', userConfig)
            : path.startsWith('/tasks')
              ? await findError(req, '/tasks', taskConfig)
              : path.startsWith('/auth')
                ? await findError(req, '/auth', authConfig)
                : null;
        if (errorMessage) return error(res, errorMessage, 400);
        next();
    } catch (err: any) {
        return error(res, err?.message || 'Validation Error.', 400);
    }
}
