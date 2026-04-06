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
                return res.status(400).json({ message: "Account Already Exists! Please Login" });
            }

            const hashedPassword = await bcrypt.hash(passWord, 10);

            const newUser = new Auth({
                name,
                userName,
                passWord: hashedPassword
            });

            const savedUser = await newUser.save();
           res.status(201).json({Message: "Account Registered Successfully! Please Login"});
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
                return res.status(400).json({ message: "incorrect Password!!" });
            }

            const Token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "3h" });

            const isProduction = process.env.NODE_ENV === "production";
            
            res.status(200).json({ 
  message: "login Successfull!", 
  user,
  token: Token
});

        }
        catch (error) {
            res.status(500).json({ message: "Error logging in user", error: error.message });
        }
    },
    
    me: async (req, res) => {
        try {
            const userid = req.userID;
            
            const user = await Auth.findById(userid);
            console.log(user);
            return res.status(200).json({ user: user });


        }
        catch (error) {
            return res.status(500).json({ Message: "Error found on Login!!" });
        }
    },
    logoutUser: async (req, res) => { 
        try {

            res.status(200).json({ message: "Logged out Successfully" });
        }
        catch (error) {
            res.status(500).json({ message: "Error logging out user", error: error.message });
        }
    }, 
    updatePassword: async (req, res) => {
        try {
            const {userName, newPassword, confirmPassword } = req.body;

            const user = await Auth.findOne({userName});
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            if (newPassword !== confirmPassword) {
                return res.status(400).json({ message: "Passwords do not match" });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.passWord = hashedPassword;
            await user.save();

            res.status(200).json({ message: "Password updated successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error updating password", error: error.message });
        }
    }
}

module.exports = authController;