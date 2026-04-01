const express = require('express');
const authRouter = require('./Routers/authRouter');
const app = express();
app.use(express.json());

app.use('/auth', authRouter);


module.exports = app;