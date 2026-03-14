import * as yup from 'yup';

const passwordSchema = yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character');

export const loginRequestSchema = yup
    .object({
        body: yup
            .object({
                email: yup
                    .string()
                    .trim()
                    .email('Email must be valid')
                    .required('Email is required'),
                password: yup.string().required('Password is required'),
            })
            .required(),
    })
    .required();

export const resetPasswordRequestSchema = yup
    .object({
        body: yup
            .object({
                email: yup
                    .string()
                    .trim()
                    .email('Email must be valid')
                    .required('Email is required'),
            })
            .required(),
    })
    .required();

export const verifyOtpRequestSchema = yup
    .object({
        body: yup
            .object({
                email: yup
                    .string()
                    .trim()
                    .email('Email must be valid')
                    .required('Email is required'),
                otp: yup
                    .string()
                    .trim()
                    .required('OTP is required')
                    .matches(/^\d{4,8}$/, 'OTP must be between 4 and 8 digits'),
                purpose: yup.string().oneOf(['verify-email', 'reset-password']).optional(),
                newPassword: passwordSchema.optional(),
            })
            .required(),
    })
    .required();

export const refreshAccessTokenRequestSchema = yup
    .object({
        body: yup
            .object({
                refreshToken: yup.string().trim().required('Refresh token is required'),
            })
            .required(),
    })
    .required();
