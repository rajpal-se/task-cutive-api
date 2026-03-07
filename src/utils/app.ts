import { Response } from 'express';

export function success<T = any>(res: Response, data: T, statusCode = 200) {
    if ((data as any)?.data && (data as any)?.message) {
        return res.status(statusCode).json({
            success: true,
            data,
            message: (data as any).message,
        });
    }
    return res.status(statusCode).json({
        success: true,
        data,
    });
}

export function error(res: Response, message: string, statusCode = 400) {
    return res.status(statusCode).json({
        success: false,
        message,
    });
}
