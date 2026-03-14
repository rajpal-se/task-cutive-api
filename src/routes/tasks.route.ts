import { Router } from 'express';
import {
    createTask,
    deleteTask,
    getAllTasks,
    getTaskById,
    updateTask,
} from '../controllers/tasks.controller.js';
import { requireAuth } from '../middlewares/auth.js';

const tasksRouter = Router();

tasksRouter.route('/').get(requireAuth(), getAllTasks).post(requireAuth(), createTask);

tasksRouter
    .route('/:taskId')
    .get(requireAuth(), getTaskById)
    .patch(requireAuth(), updateTask)
    .delete(requireAuth(), deleteTask);

export default tasksRouter;
