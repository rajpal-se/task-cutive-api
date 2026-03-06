import express from 'express';

const tasksRouter = express.Router();

tasksRouter
    .route('/')
    .get((req, res) => {
        res.send('Get all tasks');
    })
    .post((req, res) => {
        res.send('Create a new task');
    });

tasksRouter
    .route('/:taskId')
    .patch((req, res) => {
        res.send(`Update task with ID ${req.params.taskId}`);
    })
    .delete((req, res) => {
        res.send(`Delete task with ID ${req.params.taskId}`);
    });

export default tasksRouter;
