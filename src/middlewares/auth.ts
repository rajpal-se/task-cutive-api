import { NextFunction, Request, Response } from 'express';
import { error, getAuthSecret, verifySignedToken } from '../utils/index.js';

interface AuthMiddlewareOptions {
    roles?: Array<'user' | 'admin'>;
}

function getBearerToken(req: Request): string | null {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        return null;
    }

    const [scheme, token] = authorizationHeader.split(' ');

    if (!scheme || !token || scheme.toLowerCase() !== 'bearer') {
        return null;
    }

    return token.trim();
}

export function requireAuth(options: AuthMiddlewareOptions = {}) {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            const token = getBearerToken(req);

            if (!token) {
                error(res, 'Authorization header with Bearer token is required', 401);
                return;
            }

            const payload =
                verifySignedToken(token, getAuthSecret('access')) ??
                verifySignedToken(token, getAuthSecret('refresh'));

            if (!payload || !(payload.type === 'access' || payload.type === 'refresh')) {
                if (payload?.type === 'refresh') {
                    error(res, 'Invalid or expired refresh token', 401);
                } else {
                    error(res, 'Invalid or expired access token', 401);
                }
                return;
            }

            if (options.roles?.length && !options.roles.includes(payload.role)) {
                error(res, 'You are not authorized to access this resource', 403);
                return;
            }

            req.auth = payload;

            next();
        } catch (e: any) {
            error(res, e?.message || 'Failed to authenticate request', 500);
        }
    };
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
    return requireAuth({ roles: ['admin'] })(req, res, next);
}
