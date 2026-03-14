import crypto from 'node:crypto';
import EmailService from '../services/email/index.js';
import UsersSchema from '../models/users.schema.js';
import { config } from '../config/index.js';

export interface AuthTokenPayload {
    sub: string;
    email: string;
    role: 'user' | 'admin';
    type: 'access' | 'refresh';
    iat: number;
    exp: number;
}

function base64UrlEncode(value: string): string {
    return Buffer.from(value).toString('base64url');
}

function base64UrlDecode(value: string): string {
    return Buffer.from(value, 'base64url').toString('utf8');
}

function createSignature(input: string, secret: string): string {
    return crypto.createHmac('sha256', secret).update(input).digest('base64url');
}

export function createSignedToken(
    payload: Omit<AuthTokenPayload, 'iat' | 'exp'>,
    secret: string,
    expiresInSeconds = 60 * 60, // default 1 hour
): string {
    const header = {
        alg: 'HS256',
        typ: 'JWT',
    };
    const issuedAt = Math.floor(Date.now() / 1000);
    const fullPayload: AuthTokenPayload = {
        ...payload,
        iat: issuedAt,
        exp: issuedAt + expiresInSeconds,
    };

    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));
    const signingInput = `${encodedHeader}.${encodedPayload}`;
    const signature = createSignature(signingInput, secret);

    return `${signingInput}.${signature}`;
}

export function verifySignedToken(token: string, secret: string): AuthTokenPayload | null {
    try {
        const [encodedHeader, encodedPayload, signature] = token.split('.');
        if (!encodedHeader || !encodedPayload || !signature) return null;

        const signingInput = `${encodedHeader}.${encodedPayload}`;
        const expectedSignature = createSignature(signingInput, secret);

        const providedBuffer = Buffer.from(signature);
        const expectedBuffer = Buffer.from(expectedSignature);

        if (
            providedBuffer.length !== expectedBuffer.length ||
            !crypto.timingSafeEqual(providedBuffer, expectedBuffer)
        ) {
            return null;
        }

        const payload = JSON.parse(base64UrlDecode(encodedPayload)) as AuthTokenPayload;
        if (!payload.exp || payload.exp <= Math.floor(Date.now() / 1000)) {
            return null;
        }

        return payload;
    } catch {
        return null;
    }
}

const { ACCESS_TOKEN_TTL_SECONDS, REFRESH_TOKEN_TTL_SECONDS, OTP_EXPIRY_SECONDS } = config;

export function normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
}

export function clearVerifyMeta() {
    return {
        otp: '',
        issued_at: new Date(),
        used_for: '',
    } as const;
}

export function isOtpExpired(issuedAt: Date | undefined): boolean {
    if (!issuedAt) return true;
    return Date.now() - new Date(issuedAt).getTime() > OTP_EXPIRY_SECONDS * 1000;
}

export function getAuthSecret(type: 'access' | 'refresh'): string {
    const secret =
        type === 'access'
            ? process.env.JWT_ACCESS_TOKEN_SECRET?.trim()
            : process.env.JWT_REFRESH_TOKEN_SECRET?.trim();
    if (!secret) {
        throw new Error(
            `${type === 'access' ? 'JWT_ACCESS_TOKEN_SECRET' : 'JWT_REFRESH_TOKEN_SECRET'} is required`,
        );
    }
    return secret;
}

export function issueAuthTokens(user: InstanceType<typeof UsersSchema>) {
    const accessSecret = getAuthSecret('access');
    const refreshSecret = getAuthSecret('refresh');
    const tokenBasePayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
    };

    return {
        accessToken: createSignedToken(
            { ...tokenBasePayload, type: 'access' },
            accessSecret,
            ACCESS_TOKEN_TTL_SECONDS,
        ),
        refreshToken: createSignedToken(
            { ...tokenBasePayload, type: 'refresh' },
            refreshSecret,
            REFRESH_TOKEN_TTL_SECONDS,
        ),
        expiresIn: ACCESS_TOKEN_TTL_SECONDS,
    };
}

export async function sendOtpEmail(
    user: InstanceType<typeof UsersSchema>,
    purpose: 'verify-email' | 'reset-password',
): Promise<void> {
    const emailService = EmailService.fromEnv();
    const otp = emailService.generateOtp();

    user.verifyMeta = {
        otp,
        issued_at: new Date(),
        used_for: purpose,
    };
    await user.save();

    await emailService.load();

    const payload = {
        to: user.email,
        otp,
        expiresInMinutes: Math.floor(OTP_EXPIRY_SECONDS / 60),
        recipientName: user.firstName,
    };

    if (purpose === 'verify-email') {
        await emailService.sendVerificationOtp(payload);
        return;
    }

    await emailService.sendPasswordResetOtp(payload);
}
