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

    getData: () => Omit<Task, 'userId'>;
}

export const TasksSchema: mongoose.Schema<Task> = new mongoose.Schema<Task>(
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
            trim: true,
            maxlength: [2000, '[Description] too long'],
            default: '',
        },

        is_high_priority: {
            type: Boolean,
            default: false,
        },

        is_completed: {
            type: Boolean,
            default: false,
        },

        created_at: {
            type: Date,
            default: Date.now,
        },

        updated_at: {
            type: Date,
            default: Date.now,
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

TasksSchema.pre('save', async function () {
    if (this.isModified('is_high_priority')) {
        this.is_high_priority = Boolean(this.is_high_priority);
    }
    if (this.isModified('is_completed')) {
        this.is_completed = Boolean(this.is_completed);
    }
    if (this.isModified('due_datetime')) {
        this.due_datetime = new Date(this.due_datetime);
    }

    if (!this.isNew) {
        this.created_at = this.get('created_at'); // reset to original
        this.updated_at = new Date();
        this._id = this.get('_id');
        this.__v = this.get('__v') + 1;
    }
});

TasksSchema.methods.getData = function () {
    const obj = this.toObject();
    delete obj.userId;
    return obj;
};

export default mongoose.model<Task>('Tasks', TasksSchema);
