import { configDotenv } from 'dotenv';
import cors from 'cors';
import express from 'express';
import indexRouter from './routes/index.route.js';
import { connectDB } from './db/connect-db.js';
import { envSchema } from './validators/app.js';

const isProduction = process.env.NODE_ENV === 'production';
if (isProduction) {
    console.log('Running in production mode');
} else {
    console.log('Running in development mode');
}

configDotenv({
    path: isProduction ? '.env.production' : '.env',
});

const app = express();
const PORT = process.env.PORT || 5002;

app.use(
    cors({
        origin: isProduction ? process.env.FRONTEND_ORIGIN : undefined,
    }),
);
app.use(express.json());

app.use('/v1', indexRouter);

async function runApp() {
    try {
        await envSchema.validate(process.env, { abortEarly: true });
    } catch (error: any) {
        console.error('Environment variables validation error:', error?.message);
        process.exit(1);
    }

    try {
        await connectDB(process.env.MONGO_URI!, process.env.DB_NAME!);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1);
    }

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

runApp();
