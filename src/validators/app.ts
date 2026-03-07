import * as yup from 'yup';

export const envSchema = yup
    .object({
        PORT: yup.string().required('PORT is required').matches(/^\d+$/, 'PORT must be a number'),
        MONGO_URI: yup.string().required('MONGO_URI is required'),
        DB_NAME: yup.string().required('DB_NAME is required'),
    })
    .required();
