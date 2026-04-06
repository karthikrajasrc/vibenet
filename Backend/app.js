const express = require('express');
const authRouter = require('./Routers/authRouter');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const requestRouter = require('./Routers/requestRouter');
const postRouter = require('./Routers/postRouter');
const { isAuthenticated } = require('./Middlewares/auth');
const { getNotifications } = require('./Routers/notificationRouter');
const router = require('./Routers/messageRouter');
const storyRouter = require('./Routers/storyRouter');
const upload = require('./Middlewares/upload');
app.use(cookieParser());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
require('dotenv').config();

app.use(cors({
    origin: process.env.BASE_URL,
    credentials: true
}));

app.use('/auth', authRouter);
app.use("/request", requestRouter);
app.use("/create-post", postRouter);
app.get("/notification", isAuthenticated, getNotifications);
app.use("/message", isAuthenticated, router);
app.use("/story", isAuthenticated, storyRouter);
app.post("/story/upload", isAuthenticated, upload.single("storyMedia"), (req, res) => {
    res.status(200).json({ 
        url: req.file.path 
    });
});
app.get("/ping", (req, res) => {
  res.status(200).send("Server is alive 🚀");
});



module.exports = app;