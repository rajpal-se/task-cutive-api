export type EmailOtpPurpose = 'verify-email' | 'reset-password';

export interface EmailAddress {
    email: string;
    name?: string;
}

export interface EmailTemplateResult {
    subject: string;
    html: string;
    text: string;
}

export interface EmailServiceConfig {
    appName: string;
    appEmail: string;

    oauthClientId: string;
    oauthClientSecret: string;
    oauthRefreshToken: string;
    oauthRedirectUri: string;
    oauthAccessToken?: string;
}

export interface SendEmailInput {
    to: string | EmailAddress | Array<string | EmailAddress>;
    subject: string;
    html: string;
    text: string;
    from?: string | EmailAddress;
    // replyTo?: string;
}

export interface SendOtpEmailInput {
    to: string;
    otp: string;
    expiresInMinutes: number;
    recipientName?: string;
}

export interface BuildOtpTemplateInput extends SendOtpEmailInput {
    appName: string;
    // replyTo?: string;
}

export interface SendEmailResult {
    accepted: string[];
    rejected: string[];
    messageId: string;
    response: string;
}
