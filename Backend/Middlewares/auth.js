const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = {
  isAuthenticated: (req, res, next) => {
    try {
      const token = req.cookies?.token;

      if (!token) {
        return res.status(401).json({ message: "No token, Unauthorized" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.userID = decoded.id;

      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  }
};

module.exports = auth;