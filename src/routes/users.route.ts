import { Router } from 'express';
import {
    createUser,
    deleteUser,
    getAllUsers,
    getUser,
    updateUser,
} from '../controllers/users.controller.js';
import { requireAdmin, requireAuth } from '../middlewares/auth.js';

const usersRouter = Router();

usersRouter
    .route('/')
    .get(requireAuth(), getUser)
    .post(createUser)
    .patch(requireAuth(), updateUser)
    .delete(requireAuth(), deleteUser);

usersRouter.get('/all', requireAdmin, getAllUsers);

export default usersRouter;
