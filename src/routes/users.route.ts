import { Router } from 'express';
import {
    createUser,
    deleteUser,
    getAllUsers,
    getUser,
    updateUser,
} from '../controllers/users.controller.js';

const usersRouter = Router();

usersRouter.route('/').get(getUser).post(createUser).patch(updateUser).delete(deleteUser);

usersRouter.get('/all', getAllUsers);

export default usersRouter;
