import Handlebars from 'handlebars';
import { convert } from 'html-to-text';
import mjml2html from 'mjml';
import { BuildOtpTemplateInput, EmailOtpPurpose, EmailTemplateResult } from './types.js';

const templateEngine = Handlebars.create();

const shellPartial = `
<mj-section padding="0 0 18px">
    <mj-column>
        <mj-text align="center" color="#6b7280" font-size="12px" line-height="18px">
            Sent by {{appName}}{{#if replyTo}} | Reply to {{replyTo}}{{/if}}
        </mj-text>
    </mj-column>
</mj-section>`;

const otpHeroPartial = `
<mj-section padding="24px 0 0">
    <mj-column>
        <mj-text padding="0">
            <div style="border:1px solid #e7dcc8;border-radius:28px;padding:32px;background:#fffaf2;box-shadow:0 20px 45px rgba(15, 23, 42, 0.08);">
                <div style="display:inline-block;padding:8px 14px;border-radius:999px;background:{{accent}};color:#fffdf8;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;">{{badge}}</div>
                <div style="margin-top:20px;font-size:28px;line-height:34px;font-weight:700;color:#111827;">{{heading}}</div>
                <div style="margin-top:10px;font-size:16px;line-height:28px;color:#1f2937;">Hi {{recipientName}},</div>
                <div style="margin-top:10px;font-size:16px;line-height:28px;color:#374151;">{{intro}}</div>
                <div style="margin-top:24px;padding:24px;border-radius:24px;background:#ffffff;border:1px solid #eadfcd;text-align:center;">
                    <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#6b7280;">One-time password</div>
                    <div style="margin-top:12px;font-size:36px;line-height:42px;font-weight:700;letter-spacing:10px;color:{{accent}};">{{otp}}</div>
                    <div style="margin-top:12px;font-size:14px;line-height:22px;color:#4b5563;">This code expires in {{expiresInMinutes}} minutes.</div>
                </div>
                <div style="margin-top:24px;font-size:15px;line-height:26px;color:#374151;">{{note}}</div>
                <div style="margin-top:10px;font-size:14px;line-height:24px;color:#6b7280;">{{appName}} will never ask you to share this code with anyone.</div>
            </div>
        </mj-text>
    </mj-column>
</mj-section>`;

const otpMjmlTemplate = `
<mjml>
    <mj-head>
        <mj-title>{{subject}}</mj-title>
        <mj-preview>{{heading}}</mj-preview>
        <mj-attributes>
            <mj-all font-family="Verdana, Geneva, sans-serif" />
            <mj-text color="#1f2937" />
        </mj-attributes>
        <mj-style inline="inline">
            .card-shell {
                box-shadow: 0 20px 45px rgba(15, 23, 42, 0.08);
                border: 1px solid #e7dcc8;
            }
        </mj-style>
    </mj-head>
    <mj-body background-color="#f5efe6">
        {{> otpHero}}
        {{> shellFooter}}
    </mj-body>
</mjml>`;

templateEngine.registerPartial('otpHero', otpHeroPartial);
templateEngine.registerPartial('shellFooter', shellPartial);

const compileOtpMjml = templateEngine.compile(otpMjmlTemplate);

function getTemplateMeta(purpose: EmailOtpPurpose) {
    if (purpose === 'verify-email') {
        return {
            subjectPrefix: 'Verify your email',
            badge: 'Email verification',
            heading: 'Confirm your email address',
            intro: 'Use the one-time password below to verify your email address and finish setting up your account.',
            note: 'If you did not create this account, you can ignore this email.',
            accent: '#0f766e',
        };
    }

    return {
        subjectPrefix: 'Reset your password',
        badge: 'Password reset',
        heading: 'Use this code to reset your password',
        intro: 'We received a request to reset your password. Use the one-time password below to continue.',
        note: 'If you did not request a password reset, you should change your password after signing in.',
        accent: '#b45309',
    };
}

function buildTemplateContext(purpose: EmailOtpPurpose, input: BuildOtpTemplateInput) {
    const meta = getTemplateMeta(purpose);

    return {
        ...meta,
        subject: `${meta.subjectPrefix} | ${input.appName}`,
        appName: input.appName,
        recipientName: input.recipientName || 'there',
        otp: input.otp,
        expiresInMinutes: input.expiresInMinutes,
        replyTo: input.replyTo,
    };
}

function renderHtmlFromMjml(template: string): string {
    const result = mjml2html(template, {
        validationLevel: 'strict',
    });

    if (result.errors.length > 0) {
        const message = (result.errors as Array<{ formattedMessage: string }>)
            .map((item) => item.formattedMessage)
            .join('\n');
        throw new Error(`Failed to render email template:\n${message}`);
    }

    return result.html;
}

function renderTextFromHtml(html: string): string {
    return convert(html, {
        wordwrap: 100,
        selectors: [
            { selector: 'img', format: 'skip' },
            { selector: 'a', options: { hideLinkHrefIfSameAsText: true } },
        ],
    });
}

export function buildOtpTemplate(
    purpose: EmailOtpPurpose,
    input: BuildOtpTemplateInput,
): EmailTemplateResult {
    const context = buildTemplateContext(purpose, input);
    const mjml = compileOtpMjml(context);
    const html = renderHtmlFromMjml(mjml);
    const text = renderTextFromHtml(html);

    return {
        subject: context.subject,
        html,
        text,
    };
}

export function buildEmailVerificationOtpTemplate(
    input: BuildOtpTemplateInput,
): EmailTemplateResult {
    return buildOtpTemplate('verify-email', input);
}

export function buildPasswordResetOtpTemplate(input: BuildOtpTemplateInput): EmailTemplateResult {
    return buildOtpTemplate('reset-password', input);
}
