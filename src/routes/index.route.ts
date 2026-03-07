import { Router } from 'express';
import usersRouter from './users.route.js';
import authRouter from './auth.route.js';
import tasksRouter from './tasks.route.js';
import { healthCheck } from '../controllers/health.contoller.js';

const indexRouter = Router();

indexRouter.use('/auth', authRouter);
indexRouter.use('/users', usersRouter);
indexRouter.use('/tasks', tasksRouter);

indexRouter.get('/health', healthCheck);

export default indexRouter;
