const Auth = require("../Models/authModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const authController = {
    registerUser: async (req, res) => {
        try {
            const { name, userName, passWord } = req.body;
            
            const alreadyExist = await Auth.findOne({ userName });
            if (alreadyExist) {
                return res.status(400).json({ message: "Account Already Exists" });
            }

            const hashedPassword = await bcrypt.hash(passWord, 10);

            const newUser = new Auth({
                name,
                userName,
                passWord: hashedPassword
            });

            const savedUser = await newUser.save();
           res.status(201).json({Message: "User Registered Successfully", user: savedUser});
        }
        catch (error){
            res.status(500).json({ message: "Error registering user", error: error.message });
        }
    },
    loginUser: async (req, res) => {
        try {
            const {userName, passWord} = req.body;

            const user = await Auth.findOne({ userName });
            if (!user) {
                return res.status(404).json({ message: "Please Register" });
            }

            const loggedUser = await bcrypt.compare(passWord, user.passWord);
            if (!loggedUser) {
                return res.status(400).json({ message: "Password is Incorret!!" });
            }

            const Token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
            
            res.cookie("token", Token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            });

            res.status(200).json({ message: "User Logged in Successfully", user});
        }
        catch (error) {
            res.status(500).json({ message: "Error logging in user", error: error.message });
        }
    }, 
    logoutUser: async (req, res) => { 
        try {
            res.clearCookie("token", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            });
            res.status(200).json({ message: "User Logged out Successfully" });
        }
        catch (error) {
            res.status(500).json({ message: "Error logging out user", error: error.message });
        }
    }
}

module.exports = authController;