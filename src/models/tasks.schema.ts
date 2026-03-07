import mongoose from 'mongoose';

export interface Task extends mongoose.Document {
    title: string;
    description: string;
    is_high_priority: boolean;
    is_completed: boolean;
    completed_at: Date | null;
    due_datetime: Date;
    created_at?: Date;
    updated_at?: Date;
}

const TaskSchema: mongoose.Schema<Task> = new mongoose.Schema<Task>(
    {
        title: {
            type: String,
            required: [true, '[Title] must provide'],
            trim: true,
            maxlength: [200, '[Title] too long'],
        },

        description: {
            type: String,
            required: [true, '[Description] must provide'],
            trim: true,
            maxlength: [2000, '[Description] too long'],
        },

        is_high_priority: {
            type: Boolean,
            default: false,
        },

        is_completed: {
            type: Boolean,
            default: false,
        },

        completed_at: {
            type: Date,
            default: null,
        },

        due_datetime: {
            type: Date,
            default: () => Date.now() + 24 * 60 * 60 * 1000,
        },
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
    },
);

export default TaskSchema;
