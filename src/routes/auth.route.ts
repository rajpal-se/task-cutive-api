import { Router } from 'express';
import {
    login,
    logout,
    refreshAccessToken,
    resetPassword,
    verifyOTP,
} from '../controllers/auth.controller.js';

const authRouter = Router();

authRouter
    .post('/login', login)
    .post('/logout', logout)
    .post('/reset-password', resetPassword)
    .post('/verify-otp', verifyOTP)
    .post('/refresh-access-token', refreshAccessToken);

export default authRouter;
