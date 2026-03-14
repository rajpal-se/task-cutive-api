import * as yup from 'yup';

export const createUserRequestSchema = yup
    .object({
        body: yup
            .object({
                firstName: yup.string().trim().required('First name is required'),

                lastName: yup.string().trim().required('Last name is required'),

                email: yup.string().email('Email must be valid').required('Email is required'),

                password: yup
                    .string()
                    .required('Password is required')
                    .min(8, 'Password must be at least 8 characters')
                    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
                    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
                    .matches(/[0-9]/, 'Password must contain at least one number')
                    .matches(
                        /[!@#$%^&*(),.?":{}|<>]/,
                        'Password must contain at least one special character',
                    ),
            })
            .required(),
    })
    .required();

export const getUserRequestSchema = yup
    .object({
        query: yup.object({}).optional(),
    })
    .required();

export const updateUserRequestSchema = yup
    .object({
        body: yup
            .object({
                firstName: yup.string().trim(),
                lastName: yup.string().trim(),
            })
            .test('at-least-one', 'At least one of firstName or lastName is required', (value) =>
                Boolean(value?.firstName || value?.lastName),
            )
            .strict(true)
            .noUnknown(true, 'Only firstName and lastName are allowed')
            .required(),
    })
    .required();

export const deleteUserRequestSchema = yup
    .object({
        query: yup.object({}).optional(),
    })
    .required();
