import { Router } from 'express';
import usersRouter from './users.route.js';
import authRouter from './auth.route.js';
import tasksRouter from './tasks.route.js';
import { healthCheck } from '../controllers/health.contoller.js';
import { validateRequestMiddleware } from '../middlewares/validation.js';

const indexRouter = Router();

indexRouter.get('/health', healthCheck);

indexRouter.use(validateRequestMiddleware);

indexRouter.use('/auth', authRouter);
indexRouter.use('/users', usersRouter);
indexRouter.use('/tasks', tasksRouter);

export default indexRouter;
