import mongoose from 'mongoose';

export async function connectDB(uri: string, dbName: string): Promise<void> {
    await mongoose.connect(uri, {
        dbName,
    });
}
