import crypto from 'node:crypto';

export interface AuthTokenPayload {
    sub: string;
    userId: string;
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
