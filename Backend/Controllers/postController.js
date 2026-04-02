const { updateMany } = require("../Models/authModel");
const Post = require("../Models/PostModel");

const postController = {
    createPost: async (req, res) => {
        try {
            const userId = req.userID;
            const { text } = req.body || {};
            const postPic = req.files?.postPic?.[0]?.path || null;
            const postVideo = req.files?.postVideo?.[0]?.path || null;

            const post = new Post({
                userId,
                text,
                image: postPic,
                video: postVideo
            });

            await post.save();

            return res.status(201).json({ message: "Post created successfully" });
        }
        catch (error) {
            res.status(500).json({ message: "Error creating post", error: error.message });
        }
    }, 
    updatePost: async (req, res) => {
        try {
            const userId = req.userID;
            const postId = req.params.id;
            const { text } = req.body || {};
            const postPic = req.files?.postPic?.[0]?.path || null;
            const postVideo = req.files?.postVideo?.[0]?.path || null;

            const post = await Post.findById(postId);

            if (!post) {
                return res.status(404).json({ message: "Post not found" });
            }

            if (post.userId.toString() !== userId) {
                return res.status(403).json({ message: "Unauthorized" });
            }

            post.text = text || post.text;
            post.image = postPic || post.image;
            post.video = postVideo || post.video;

            await post.save();

            return res.status(200).json({ message: "Post updated successfully" });
        }
        catch (error) {
            res.status(500).json({ message: "Error updating post", error: error.message });
        }
    }, 
    deletePost: async (req, res) => {
        try {
            const userId = req.userID;
            const postId = req.params.id;

            const post = await Post.findById(postId);

            if (!post) {
                return res.status(404).json({ message: "Post not found" });
            }

            if (post.userId.toString() !== userId) {
                return res.status(403).json({ message: "Unauthorized" });
            }

            await Post.findByIdAndDelete(postId);

            return res.status(200).json({ message: "Post deleted successfully" });
        }
        catch (error) {
            res.status(500).json({ message: "Error deleting post", error: error.message });
        }
    }, 
    getAllPosts: async (req, res) => {
        try {
            const posts = await Post.find().populate("userId", "userName profilePic").sort({ createdAt: -1 });
            return res.status(200).json({ posts });
        }
        catch (error) {
            res.status(500).json({ message: "Error getting posts", error: error.message });
        }
    }, 
    getUserPosts: async (req, res) => {
        try {
            const userId = req.params.id;
            const posts = await Post.find({ userId }).populate("userId", "userName profilePic").sort({ createdAt: -1 });
            return res.status(200).json({ posts });
        }
        catch (error) {
            res.status(500).json({ message: "Error getting user posts", error: error.message });
        }
    }
}

module.exports = postController;