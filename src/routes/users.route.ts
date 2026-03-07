import { Router } from 'express';
import { createUser, deleteUser, getUser, updateUser } from '../controllers/users.controller.js';

const usersRouter = Router();

usersRouter.route('/').get(getUser).post(createUser).patch(updateUser).delete(deleteUser);

export default usersRouter;
