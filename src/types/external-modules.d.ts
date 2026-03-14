import type { AuthTokenPayload } from '../utils/auth.js';

declare global {
    namespace Express {
        interface Request {
            auth?: AuthTokenPayload;
        }
    }
}

declare module 'html-to-text' {
    export interface HtmlToTextOptions {
        wordwrap?: number | false;
        selectors?: Array<{
            selector: string;
            format?: string;
            options?: Record<string, unknown>;
        }>;
    }

    export function convert(html: string, options?: HtmlToTextOptions): string;
}

declare module 'mjml' {
    export interface MjmlError {
        formattedMessage: string;
    }

    export interface MjmlResult {
        html: string;
        errors: MjmlError[];
    }

    export interface MjmlOptions {
        validationLevel?: 'skip' | 'soft' | 'strict';
    }

    export default function mjml2html(input: string, options?: MjmlOptions): MjmlResult;
}

export {};
