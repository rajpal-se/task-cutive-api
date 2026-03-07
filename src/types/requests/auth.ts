import { Request } from 'express';

export interface RegisterUserRequest extends Request {
    body: {
        email: string;
        password: string;
        name: string;
    };
}

export interface LoginUserRequest extends Request {
    body: {
        email: string;
        password: string;
        name: string;
    };
}

export interface LogoutUserRequest extends Request {}

export interface ResetPasswordRequest extends Request {
    body: {
        email: string;
    };
}

export interface VerifyOTPRequest extends Request {
    body: {
        email: string;
        otp: string;
    };
}

export interface RefreshAccessTokenRequest extends Request {
    body: {
        refreshToken: string;
    };
}
