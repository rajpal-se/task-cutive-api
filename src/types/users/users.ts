export interface User {
    _id: string;
    fname: string;
    lname: string;
    email: string;
    pass: string;
    role: 'user' | 'admin';
    verified: boolean;
    verifyMeta: {
        otp: string;
        issued_at: Date;
        used_for: '' | 'verify-email' | 'reset-password';
    };
    created_at: Date;
    updated_at: Date;
}
