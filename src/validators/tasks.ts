import * as yup from 'yup';
import { DateField, NumberField, ObjectIdField } from './app.js';

export const createTaskRequestSchema = yup
    .object({
        body: yup
            .object({
                title: yup.string().trim().required('Title is required'),
                description: yup.string().trim(),
                isHighPriority: yup.boolean().optional(),
                dueDatetime: DateField('Due datetime', false).optional(),
            })
            .required(),

        query: yup
            .object({
                userId: ObjectIdField('User ID', true),
            })
            .required(),
    })
    .required();

export const getAllTasksRequestSchema = yup
    .object({
        query: yup
            .object({
                userId: ObjectIdField('User ID', true),
                filter: yup
                    .string()
                    .oneOf(['done', 'pending', 'expired', 'recent', 'upcoming'])
                    .optional(),
                page: NumberField('Page', false),
                perPage: NumberField('Per Page', false),
            })
            .required(),
    })
    .required();

export const getTaskByIdRequestSchema = yup
    .object({
        params: yup
            .object({
                taskId: ObjectIdField('Task ID', true),
            })
            .required(),
        query: yup
            .object({
                userId: ObjectIdField('User ID', true),
            })
            .required(),
    })
    .required();

export const updateTaskRequestSchema = yup
    .object({
        params: yup
            .object({
                taskId: ObjectIdField('Task ID', true),
            })
            .required(),
        body: yup
            .object({
                title: yup.string().trim().optional(),
                description: yup.string().trim().optional(),
                isHighPriority: yup.boolean().optional(),
                isCompleted: yup.boolean().optional(),
                dueDatetime: DateField('Due datetime', false).optional(),
            })
            .test('at-least-one-task-field', 'At least one task field is required', (value) =>
                Boolean(
                    value?.title ||
                    value?.description ||
                    value?.isHighPriority !== undefined ||
                    value?.isCompleted !== undefined ||
                    value?.dueDatetime,
                ),
            ),
        query: yup
            .object({
                userId: ObjectIdField('User ID', true),
            })
            .required(),
    })
    .required();

export const deleteTaskRequestSchema = yup
    .object({
        params: yup
            .object({
                taskId: ObjectIdField('Task ID', true),
            })
            .required(),
        query: yup
            .object({
                userId: ObjectIdField('User ID', true),
            })
            .required(),
    })
    .required();
