import express from 'express';

const authRouter = express.Router();

authRouter
    .post('/login', (req, res) => {
        res.send('User login');
    })
    .post('/logout', (req, res) => {
        res.send('User logout');
    })
    .post('/reset-password', (req, res) => {
        res.send('Reset user password');
    })
    .post('/verify-otp', (req, res) => {
        res.send('Verify user email');
    })
    .post('/refresh-access-token', (req, res) => {
        res.send("Refresh user's Access token");
    });

export default authRouter;
