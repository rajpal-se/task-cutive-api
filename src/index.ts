import { configDotenv } from 'dotenv';
import express from 'express';
import indexRouter from './routes/index.route.js';

configDotenv();

const app = express();
const PORT = process.env.PORT || 5002;

app.use(express.json());

app.use('/v1', indexRouter);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
