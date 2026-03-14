import * as yup from 'yup';
import { DateField, NumberField, ObjectIdField } from './app.js';

export const createTaskRequestSchema = yup
    .object({
        body: yup
            .object({
                title: yup.string().trim().required('Title is required'),
                description: yup.string().trim(),
                is_high_priority: yup.boolean().optional(),
                due_datetime: DateField('Due datetime', false).optional(),
            })
            .required(),
    })
    .required();

export const getAllTasksRequestSchema = yup
    .object({
        query: yup
            .object({
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
                is_high_priority: yup.boolean().optional(),
                is_completed: yup.boolean().optional(),
                due_datetime: DateField('Due datetime', false).optional(),
            })
            .test('at-least-one-task-field', 'At least one task field is required', (value) =>
                Boolean(
                    value?.title ||
                    value?.description ||
                    value?.is_high_priority !== undefined ||
                    value?.is_completed !== undefined ||
                    value?.due_datetime,
                ),
            ),
    })
    .required();

export const deleteTaskRequestSchema = yup
    .object({
        params: yup
            .object({
                taskId: ObjectIdField('Task ID', true),
            })
            .required(),
    })
    .required();
