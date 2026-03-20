import { Response } from 'express';
import { compare } from 'bcrypt';
import {
    LoginUserRequest,
    LogoutUserRequest,
    RefreshAccessTokenRequest,
    ResetPasswordRequest,
    VerifyOTPRequest,
} from '../types/index.js';
import UsersSchema from '../models/users.schema.js';
import {
    AuthTokenPayload,
    clearVerifyMeta,
    createSignedToken,
    error,
    getAuthSecret,
    isOtpExpired,
    issueAuthTokens,
    normalizeEmail,
    sendOtpEmail,
    success,
} from '../utils/index.js';
import { config } from '../config/index.js';

export async function login(req: LoginUserRequest, res: Response): Promise<void> {
    try {
        const email = normalizeEmail(req.body.email);
        const { password } = req.body;

        const user = await UsersSchema.findOne({ email });
        if (!user) {
            error(res, 'Invalid email or password', 401);
            return;
        }

        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
            error(res, 'Invalid email or password', 401);
            return;
        }

        if (!user.verified) {
            await sendOtpEmail(user, 'verify-email');
            error(res, 'Email not verified. A verification OTP has been sent to your email.', 403);
            return;
        }

        success(
            res,
            {
                data: {
                    user: user.getData(),
                    ...issueAuthTokens(user),
                },
                message: 'Login successful',
            },
            200,
        );
    } catch (e: any) {
        error(res, e?.message || 'Failed to login', 500);
    }
}

export async function logout(req: LogoutUserRequest, res: Response): Promise<void> {
    success(res, {
        data: {
            loggedOut: true,
        },
        message: 'Logout successful. Discard auth tokens on the client.',
    });
}

export async function resetPassword(req: ResetPasswordRequest, res: Response): Promise<void> {
    try {
        const email = normalizeEmail(req.body.email);
        const user = await UsersSchema.findOne({ email });

        if (user) {
            await sendOtpEmail(user, 'reset-password');
        }

        success(res, {
            data: null,
            message: 'If an account exists, a password reset OTP has been sent to the email.',
        });
    } catch (e: any) {
        error(res, e?.message || 'Failed to process password reset request', 500);
    }
}

export async function verifyOTP(req: VerifyOTPRequest, res: Response): Promise<void> {
    try {
        const email = normalizeEmail(req.body.email);
        const { otp, purpose, newPassword } = req.body;

        const user = await UsersSchema.findOne({ email });
        if (!user) {
            error(res, 'Invalid email or OTP', 400);
            return;
        }

        if (!user.verifyMeta?.otp || user.verifyMeta.otp !== otp) {
            error(res, 'Invalid email or OTP', 400);
            return;
        }

        if (purpose && user.verifyMeta.used_for !== purpose) {
            error(res, 'OTP purpose mismatch', 400);
            return;
        }

        if (isOtpExpired(user.verifyMeta.issued_at)) {
            user.verifyMeta = clearVerifyMeta();
            await user.save();
            error(res, 'OTP has expired. Please request a new one.', 400);
            return;
        }

        if (user.verifyMeta.used_for === 'reset-password') {
            if (!newPassword) {
                error(res, 'newPassword is required for password reset OTP verification', 400);
                return;
            }

            user.password = newPassword;
            user.verifyMeta = clearVerifyMeta();
            await user.save();

            success(res, {
                data: {
                    user: user.getData(),
                    ...issueAuthTokens(user),
                },
                message: 'Password reset successful',
            });
            return;
        }

        user.verified = true;
        user.verifyMeta = clearVerifyMeta();
        await user.save();

        success(res, {
            data: {
                user: user.getData(),
                ...issueAuthTokens(user),
            },
            message: 'Email verified successfully',
        });
    } catch (e: any) {
        error(res, e?.message || 'Failed to verify OTP', 500);
    }
}

export async function refreshAccessToken(
    req: RefreshAccessTokenRequest,
    res: Response,
): Promise<void> {
    try {
        const payload = req?.auth as AuthTokenPayload;
        const user = await UsersSchema.findById(payload.sub);
        if (!user || user.email !== payload.email || !user.verified) {
            error(res, 'Invalid refresh token user context', 401);
            return;
        }

        const { ACCESS_TOKEN_TTL_SECONDS } = config;

        const secret = getAuthSecret('access');
        const accessToken = createSignedToken(
            {
                sub: user.id,
                email: user.email,
                role: user.role,
                type: 'access',
            },
            secret,
            ACCESS_TOKEN_TTL_SECONDS,
        );

        success(res, {
            data: {
                accessToken,
                expiresIn: ACCESS_TOKEN_TTL_SECONDS,
            },
            message: 'Access token refreshed successfully',
        });
    } catch (e: any) {
        error(res, e?.message || 'Failed to refresh access token', 500);
    }
}
