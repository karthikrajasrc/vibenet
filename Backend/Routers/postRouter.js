const express = require("express");
const { isAuthenticated } = require("../Middlewares/auth");
const upload = require("../Middlewares/upload");
const { createPost, updatePost, deletePost, getAllPosts, getUserPosts } = require("../Controllers/postController");
const postRouter = express.Router();

postRouter.post("/newpost", isAuthenticated,
    upload.fields([
        { name: "postPic", maxCount: 1 },
        { name: "postVideo", maxCount: 1 }
    ]), createPost);

postRouter.put("/update/:id", isAuthenticated,
    upload.fields([
        { name: "postPic", maxCount: 1 },
        { name: "postVideo", maxCount: 1 }
    ]), updatePost);

postRouter.delete("/delete/:id", isAuthenticated, deletePost);
postRouter.get("/get-posts", isAuthenticated, getAllPosts);
postRouter.get("/get-posts/:id", isAuthenticated, getUserPosts);

module.exports = postRouter;