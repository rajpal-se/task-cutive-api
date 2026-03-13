import { Request } from 'express';

export interface LoginUserRequest extends Request {
    body: {
        email: string;
        password: string;
    };
}

export interface LogoutUserRequest extends Request {
    body: {
        refreshToken?: string;
    };
}

export interface ResetPasswordRequest extends Request {
    body: {
        email: string;
    };
}

export interface VerifyOTPRequest extends Request {
    body: {
        email: string;
        otp: string;
        purpose?: 'verify-email' | 'reset-password';
        newPassword?: string;
    };
}

export interface RefreshAccessTokenRequest extends Request {
    body: {
        refreshToken: string;
    };
}
