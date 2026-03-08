import * as yup from 'yup';

export const createTaskRequestSchema = yup
    .object({
        body: yup
            .object({
                title: yup.string().trim().required('Title is required'),
                description: yup.string().trim(),
                isHighPriority: yup.mixed<boolean>().optional(),
                dueDatetime: yup.mixed<string | Date>().optional(),
            })
            .required(),

        query: yup
            .object({
                userId: yup.string().trim().required('userId query param is required'),
            })
            .required(),
    })
    .required();

export const getAllTasksRequestSchema = yup
    .object({
        query: yup
            .object({
                userId: yup.string().trim().required('userId query param is required'),
                filter: yup
                    .string()
                    .oneOf(['done', 'pending', 'expired', 'recent', 'upcoming'])
                    .optional(),
                page: yup.mixed<string | number>().optional(),
                perPage: yup.mixed<string | number>().optional(),
            })
            .required(),
    })
    .required();

export const getTaskByIdRequestSchema = yup
    .object({
        params: yup
            .object({
                taskId: yup.string().trim().required('Task ID is required'),
            })
            .required(),
        query: yup
            .object({
                userId: yup.string().trim().required('userId query param is required'),
            })
            .required(),
    })
    .required();

export const updateTaskRequestSchema = yup
    .object({
        params: yup
            .object({
                taskId: yup.string().trim().required('Task ID is required'),
            })
            .required(),
        body: yup
            .object({
                title: yup.string().trim().optional(),
                description: yup.string().trim().optional(),
                isHighPriority: yup.mixed<boolean | string | number>().optional(),
                isCompleted: yup.mixed<boolean | string | number>().optional(),
                dueDatetime: yup.mixed<string | Date>().optional(),
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
                userId: yup.string().trim().required('userId query param is required'),
            })
            .required(),
    })
    .required();

export const deleteTaskRequestSchema = yup
    .object({
        params: yup
            .object({
                taskId: yup.string().trim().required('Task ID is required'),
            })
            .required(),
        query: yup
            .object({
                userId: yup.string().trim().required('userId query param is required'),
            })
            .required(),
    })
    .required();
