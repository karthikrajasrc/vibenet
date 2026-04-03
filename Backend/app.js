const express = require('express');
const authRouter = require('./Routers/authRouter');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const requestRouter = require('./Routers/requestRouter');
const postRouter = require('./Routers/postRouter');
const { isAuthenticated } = require('./Middlewares/auth');
const { getNotifications } = require('./Routers/notificationRouter');
app.use(cookieParser());
app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use('/auth', authRouter);
app.use("/request", requestRouter);
app.use("/create-post", postRouter);
app.get("/notification", isAuthenticated, getNotifications);


module.exports = app;