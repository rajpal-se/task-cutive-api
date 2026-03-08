import crypto from 'node:crypto';
import type { SentMessageInfo, Transporter } from 'nodemailer';
import nodemailer from 'nodemailer';
import {
    buildEmailVerificationOtpTemplate,
    buildOtpTemplate,
    buildPasswordResetOtpTemplate,
} from './templates.js';
import {
    EmailAddress,
    EmailOtpPurpose,
    EmailServiceConfig,
    SendEmailInput,
    SendEmailResult,
    SendOtpEmailInput,
} from './types.js';
import { google } from 'googleapis';

function formatAddress(address: string | EmailAddress): string {
    if (typeof address === 'string') return address;
    return address.name ? `${address.name} <${address.email}>` : address.email;
}

function normalizeRecipients(recipients: SendEmailInput['to']): string[] {
    const items = Array.isArray(recipients) ? recipients : [recipients];
    return items.map(formatAddress);
}

function mapSendResult(info: SentMessageInfo): SendEmailResult {
    return {
        accepted: info.accepted,
        rejected: info.rejected,
        messageId: info.messageId,
        response: info.response,
    };
}

export class EmailService {
    private transporter: Transporter | null;
    private config: EmailServiceConfig;

    constructor(
        private readonly env: NodeJS.ProcessEnv,
        // transporter?: Transporter,
    ) {
        this.config = this.getConfig(env);
        this.transporter = null;
    }

    static fromEnv(env: NodeJS.ProcessEnv = process.env): EmailService {
        const emailService = new EmailService(env);
        return emailService;
    }

    async load() {
        await this.updateAccessToken();
        this.transporter = this.createEmailTransporter(this.config);
        return this.transporter;
    }

    generateOtp(length = 6): string {
        return Array.from({ length }, () => crypto.randomInt(0, 10)).join('');
    }

    getDefaultFromAddress(): string {
        return `${this.config.appName} <${this.config.appEmail}>`;
    }

    getConfig(env: NodeJS.ProcessEnv) {
        const {
            OAUTH_CLIENT_ID,
            OAUTH_CLIENT_SECRET,
            OAUTH_REFRESH_TOKEN,
            OAUTH_REDIRECT_URI,
            APP_NAME,
            APP_EMAIL,
        } = env;
        if (
            !OAUTH_CLIENT_ID ||
            !OAUTH_CLIENT_SECRET ||
            !OAUTH_REFRESH_TOKEN ||
            !OAUTH_REDIRECT_URI ||
            !APP_NAME ||
            !APP_EMAIL
        ) {
            throw new Error('Missing required environment variables for EmailServiceConfig');
        }

        return {
            appName: APP_NAME.trim(),
            appEmail: APP_EMAIL.trim(),

            oauthClientId: OAUTH_CLIENT_ID.trim(),
            oauthClientSecret: OAUTH_CLIENT_SECRET.trim(),
            oauthRefreshToken: OAUTH_REFRESH_TOKEN.trim(),
            oauthRedirectUri: OAUTH_REDIRECT_URI.trim(),
        };
    }

    async verifyConnection(): Promise<boolean | undefined> {
        return await this.transporter?.verify();
    }

    async updateAccessToken() {
        const config = this.config;
        const OAuth2 = google.auth.OAuth2;

        const oauth2Client = new OAuth2(
            config.oauthClientId,
            config.oauthClientSecret,
            config.oauthRedirectUri,
        );

        oauth2Client.setCredentials({
            refresh_token: config.oauthRefreshToken,
        });

        const accessToken = await oauth2Client.getAccessToken();

        config.oauthAccessToken = accessToken.token!;
    }

    createEmailTransporter(config: EmailServiceConfig): Transporter {
        return nodemailer.createTransport({
            service: 'gmail',
            pool: true,
            maxConnections: 5,
            maxMessages: 100,
            auth: {
                type: 'OAuth2',
                user: config.appEmail,
                clientId: config.oauthClientId,
                clientSecret: config.oauthClientSecret,
                refreshToken: config.oauthRefreshToken,
                accessToken: config.oauthAccessToken,
            },
        });
    }

    async send(input: SendEmailInput): Promise<SendEmailResult> {
        if (!this.transporter) return null as any;

        const info = await this.transporter.sendMail({
            from: input.from ? formatAddress(input.from) : this.getDefaultFromAddress(),
            to: normalizeRecipients(input.to),
            subject: input.subject,
            html: input.html,
            text: input.text,
            // replyTo: input.replyTo || this.config.replyTo,
        });

        return mapSendResult(info);
    }

    async sendOtpEmail(
        purpose: EmailOtpPurpose,
        input: SendOtpEmailInput,
    ): Promise<SendEmailResult> {
        const template = buildOtpTemplate(purpose, {
            ...input,
            appName: this.config.appName,
            // replyTo: this.config.replyTo,
        });

        return this.send({
            to: input.to,
            subject: template.subject,
            html: template.html,
            text: template.text,
        });
    }

    async sendVerificationOtp(input: SendOtpEmailInput): Promise<SendEmailResult> {
        const template = buildEmailVerificationOtpTemplate({
            ...input,
            appName: this.config.appName,
            // replyTo: this.config.replyTo,
        });

        return this.send({
            to: input.to,
            subject: template.subject,
            html: template.html,
            text: template.text,
        });
    }

    async sendPasswordResetOtp(input: SendOtpEmailInput): Promise<SendEmailResult> {
        const template = buildPasswordResetOtpTemplate({
            ...input,
            appName: this.config.appName,
            // replyTo: this.config.replyTo,
        });

        return this.send({
            to: input.to,
            subject: template.subject,
            html: template.html,
            text: template.text,
        });
    }
}

export * from './types.js';
export * from './templates.js';

export default EmailService;
