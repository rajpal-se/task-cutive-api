import { Response } from 'express';
import { LoginUserRequest, RegisterUserRequest, ResetPasswordRequest } from '../types/index.js';

export async function register(req: RegisterUserRequest, res: Response): Promise<void> {
    res.send('Register a new user');
}

export async function login(req: LoginUserRequest, res: Response): Promise<void> {
    res.send('User login');
}

export async function logout(req: LoginUserRequest, res: Response): Promise<void> {
    res.send('User logout');
}

export async function resetPassword(req: ResetPasswordRequest, res: Response): Promise<void> {
    res.send('Reset user password');
}

export async function verifyOTP(req: LoginUserRequest, res: Response): Promise<void> {
    res.send('Verify user email');
}

export async function refreshAccessToken(req: LoginUserRequest, res: Response): Promise<void> {
    res.send("Refresh user's Access  token");
}
