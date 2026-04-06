const express = require('express');
const { registerUser, loginUser, logoutUser, me, updatePassword } = require('../Controllers/authController');
const { isAuthenticated } = require('../Middlewares/auth');
const authRouter = express.Router();


authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.get("/me", isAuthenticated, me);
authRouter.post("/logout", isAuthenticated, logoutUser);
authRouter.put("/update", updatePassword);


module.exports = authRouter;