import mongoose from 'mongoose';
import TaskSchema from './tasks.schema.js';

const UsersSchema = new mongoose.Schema(
    {
        fname: {
            type: String,
            required: [true, '[First Name] must provide'],
            trim: true,
            maxlength: [20, '[First Name] can not be more than 20 characters'],
        },

        lname: {
            type: String,
            required: [true, '[Last Name] must provide'],
            trim: true,
            maxlength: [20, '[Last Name] can not be more than 20 characters'],
        },

        email: {
            type: String,
            required: [true, '[Email] must provide'],
            trim: true,
            lowercase: true,
            maxlength: [40, '[Email] can not be more than 40 characters'],
            unique: true,
            index: true,
        },

        pass: {
            type: String,
            required: [true, '[Password] must provide'],
            trim: true,
            maxlength: [255, '[Password] too long'],
        },

        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },

        verified: {
            type: Boolean,
            default: false,
        },

        verifyMeta: {
            otp: {
                type: String,
                default: '000000',
            },

            issued_at: {
                type: Date,
                default: Date.now,
            },

            used_for: {
                type: String,
                enum: ['', 'verify-email', 'reset-password'],
                default: '',
            },
        },

        tasks: [TaskSchema],
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
    },
);

export default mongoose.model('Users', UsersSchema);
