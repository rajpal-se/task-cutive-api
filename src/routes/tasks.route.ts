import { Router } from 'express';
import {
    createTask,
    deleteTask,
    getAllTasks,
    getTaskById,
    updateTask,
} from '../controllers/tasks.controller.js';

const tasksRouter = Router();

tasksRouter.route('/').get(getAllTasks).post(createTask);

tasksRouter.route('/:taskId').get(getTaskById).patch(updateTask).delete(deleteTask);

export default tasksRouter;
