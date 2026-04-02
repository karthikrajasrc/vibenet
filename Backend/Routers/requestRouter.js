const express = require("express");
const { sendRequest, AcceptRequest, RejectRequest, uploadProfile, getFriends, updateProfile } = require("../Controllers/requestController");
const { isAuthenticated } = require("../Middlewares/auth");
const upload = require("../Middlewares/upload");
const requestRouter = express.Router();

requestRouter.post("/send-request/:id", isAuthenticated, sendRequest);
requestRouter.post("/accept-request/:id", isAuthenticated, AcceptRequest);
requestRouter.post("/reject-request/:id", isAuthenticated, RejectRequest);
requestRouter.post("/upload-profile", isAuthenticated,
    upload.fields([
        { name: "profilePic", maxCount: 1 },
        { name: "coverPic", maxCount: 1 }
    ]), uploadProfile);

requestRouter.get("/friends", isAuthenticated, getFriends);
requestRouter.put("/update-profile", isAuthenticated, updateProfile);
module.exports = requestRouter;