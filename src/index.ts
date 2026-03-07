import { configDotenv } from 'dotenv';
import express from 'express';
import indexRouter from './routes/index.route.js';
import { connectDB } from './db/connect-db.js';
import { envSchema } from './validators/app.js';

configDotenv();

const app = express();
const PORT = process.env.PORT || 5002;

app.use(express.json());

app.use('/v1', indexRouter);

async function runApp() {
    try {
        await envSchema.validate(process.env, { abortEarly: true });
    } catch (error) {
        console.error('Environment variables validation error:', error);
        process.exit(1);
    }

    try {
        await connectDB(process.env.MONGO_URI!);
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
