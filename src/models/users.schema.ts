import mongoose from 'mongoose';
import { hashSync } from 'bcrypt';
import _ from 'lodash';

export interface User extends mongoose.Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    verified: boolean;
    verifyMeta: {
        otp: string;
        issued_at: Date;
        used_for: '' | 'verify-email' | 'reset-password';
    };
    created_at?: Date;
    updated_at?: Date;

    getData: () => Omit<User, 'password' | 'verifyMeta'>;
}

const UsersSchema: mongoose.Schema<User> = new mongoose.Schema<User>(
    {
        firstName: {
            type: String,
            required: [true, '[First Name] must provide'],
            trim: true,
            maxlength: [20, '[First Name] can not be more than 20 characters'],
        },

        lastName: {
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

        password: {
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
                default: '',
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

        created_at: {
            type: Date,
            default: Date.now,
        },

        updated_at: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
    },
);

UsersSchema.pre('save', async function () {
    // Only hash the password if it's new or modified
    if (this.isModified('firstName')) {
        this.firstName = _.startCase(this.firstName?.toLowerCase() || '');
    }
    if (this.isModified('lastName')) {
        this.lastName = _.startCase(this.lastName?.toLowerCase() || '');
    }
    if (this.isModified('email')) {
        this.email = this.email?.toLowerCase() || '';
    }
    if (this.isModified('password')) {
        const password = hashSync(this.password, 11);
        this.password = password;
    }

    if (!this.isNew) {
        // Prevent email update
        this.email = this.get('email'); // reset to original
        this.created_at = this.get('created_at');
        this.updated_at = new Date();
        this._id = this.get('_id');
        this.__v = this.get('__v') + 1;
    }
});

UsersSchema.methods.getData = function () {
    const obj = this.toObject();
    delete obj.password;
    delete obj.verifyMeta;
    return obj;
};

export default mongoose.model<User>('Users', UsersSchema);
