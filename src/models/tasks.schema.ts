import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema(
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
