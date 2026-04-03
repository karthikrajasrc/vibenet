const express = require("express");
const { isAuthenticated } = require("../Middlewares/auth");
const upload = require("../Middlewares/upload");
const { createPost, updatePost, deletePost, getAllPosts, getUserPosts, likePosts, commentPost, getComments, deleteComment, updateComment } = require("../Controllers/postController");
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

postRouter.post("/like/:id", isAuthenticated, likePosts)
postRouter.post("/comment/:id", isAuthenticated, commentPost);
postRouter.get("/get-comment/:id", isAuthenticated, getComments);
postRouter.delete("/delete-comment/:postId/:commentId", isAuthenticated, deleteComment);
postRouter.put("/update-comment/:postId/:commentId", isAuthenticated, updateComment);

module.exports = postRouter;