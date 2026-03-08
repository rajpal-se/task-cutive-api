import mongoose from 'mongoose';

export interface Task extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    description: string;
    is_high_priority: boolean;
    is_completed: boolean;
    completed_at: Date | null;
    due_datetime: Date;
    created_at?: Date;
    updated_at?: Date;
}

export const TaskSchema: mongoose.Schema<Task> = new mongoose.Schema<Task>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
            required: [true, '[User ID] must provide'],
            index: true,
        },

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

export default mongoose.model<Task>('Tasks', TaskSchema);
