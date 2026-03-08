import mongoose from 'mongoose';
import * as yup from 'yup';

export const envSchema = yup
    .object({
        PORT: yup.string().required('PORT is required').matches(/^\d+$/, 'PORT must be a number'),
        MONGO_URI: yup.string().required('MONGO_URI is required'),
        DB_NAME: yup.string().required('DB_NAME is required'),
    })
    .required();

export const ObjectIdField = (name: string, required = false) =>
    yup
        .string()
        .trim()
        .test('is-object-id', `${name} must be a valid ObjectId`, (value, context) => {
            const path = context?.from?.[1]?.value?.path;
            if (path) {
                const regex = /\/(?<resource>tasks|users)\/(?<id>.+)\/?/;
                const match = path.match(regex);
                if (match && match.groups) {
                    const { id } = match.groups;
                    // resource = "tasks" | "users"
                    // id = "69ad5d3cc24b966f497f495d"
                    return mongoose.Types.ObjectId.isValid(id);
                }
            }

            return true;
        })
        .when('$required', {
            is: required,
            then: (schema) => schema.required(`${name} is required`),
            otherwise: (schema) => schema.notRequired(),
        });

export const DateField = (name: string, required = false) =>
    yup
        .date()
        .typeError(`${name} must be a valid date`)
        .when('$required', {
            is: required,
            then: (schema) => schema.required(`${name} is required`),
            otherwise: (schema) => schema.notRequired(),
        });

export const NumberField = (name: string, required = false) =>
    yup
        .mixed<string | number>()
        .test('is-number', `${name} must be a valid number`, (value) => {
            if (value === undefined || value === null) return !required;
            const num = typeof value === 'string' ? Number(value) : value;
            return typeof num === 'number' && !Number.isNaN(num);
        })
        .typeError(`${name} must be a valid number`)
        .when('$required', {
            is: required,
            then: (schema) => schema.required(`${name} is required`),
            otherwise: (schema) => schema.notRequired(),
        });
