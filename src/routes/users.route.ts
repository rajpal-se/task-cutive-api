import express from 'express';

const usersRouter = express.Router();

usersRouter
    .route('/')
    .get((req, res) => {
        res.send('Get user profile');
    })
    .patch((req, res) => {
        res.send('Update user profile');
    })
    .delete((req, res) => {
        res.send('Delete user profile');
    });

usersRouter.route('/').post((req, res) => {
    res.send('Create a new user');
});

export default usersRouter;
