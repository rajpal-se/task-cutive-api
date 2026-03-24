import { Router } from 'express';
import {
    login,
    logout,
    refreshAccessToken,
    resetPassword,
    verifyOTP,
} from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewares/auth.js';

const authRouter = Router();

authRouter
    .post('/login', login)
    .post('/logout', requireAuth(), logout)
    .post('/reset-password', resetPassword)
    .post(
        '/verify-otp',
        (req, res, next) =>
            req.body?.purpose === 'verify-email' ? requireAuth()(req, res, next) : next(),
        verifyOTP,
    )
    .post('/refresh-access-token', requireAuth(), refreshAccessToken);

export default authRouter;
