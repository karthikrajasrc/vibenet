const { updateMany } = require("../Models/authModel");
const Post = require("../Models/PostModel");
const User = require("../Models/authModel");
const Notification = require("../Models/notificationModel");

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
    }, 
    likePosts: async (req, res) => {
        try {
            const userId = req.userID;
            const postId = req.params.id;

            const post = await Post.findById(postId).populate("userId");;
            if (!post) {
  return res.status(404).json({ message: "Post not found" });
}

            const liker = await User.findById(userId).select("userName profilePic");

            const receiverId = post.userId._id.toString();      

if (!post.likes) {
  post.likes = [];
}

let isLiked;

if (post.likes.includes(userId)) {
  post.likes = post.likes.filter(id => id.toString() !== userId);
  isLiked = false;
} else {
  post.likes.push(userId);
  isLiked = true;
            }

            await post.save();

                        global.io.emit("postLiked", {
  postId: post._id,
  userId
});
            
            if (isLiked && receiverId !== userId) {
  const newNotification = await Notification.create({
    senderId: userId,
    receiverId,
    postId: post._id,
    type: "like"
  });

  const receiverSocket = global.users[receiverId];

  if (receiverSocket) {
    global.io.to(receiverSocket).emit("notification", {
      _id: newNotification._id,
      userName: liker.userName,
      profilePic: liker.profilePic,
      message: `${liker.userName} liked your post ❤️`,
      createdAt: newNotification.createdAt
    });
  }
}

            return res.status(200).json({ message: "Post liked successfully" });
        }
        catch (error) {
            res.status(500).json({ message: "Error liking post", error: error.message });
        }
    },
    commentPost: async (req, res) => {
  try {
    const userId = req.userID;
    const postId = req.params.id;
    const { text } = req.body;

    const post = await Post.findById(postId).populate("userId");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const commenter = await User.findById(userId).select("userName profilePic");
    const receiverId = post.userId._id.toString();

    if (!post.comment) {
      post.comment = [];
    }


    const newComment = {
      userId,
      text,
      createdAt: new Date()
    };

    post.comment.push(newComment);

    await post.save();


    global.io.emit("newComment", {
      postId: post._id,
      comment: {
        userId,
        userName: commenter.userName,
        profilePic: commenter.profilePic,
        text
      }
    });

    if (receiverId !== userId) {
      const newNotification = await Notification.create({
        senderId: userId,
        receiverId,
        postId: post._id,
        type: "comment"
      });

      const receiverSocket = global.users[receiverId];

      if (receiverSocket) {
        global.io.to(receiverSocket).emit("notification", {
          _id: newNotification._id,
          userName: commenter.userName,
          profilePic: commenter.profilePic,
          message: `${commenter.userName} commented on your post 💬`,
          createdAt: newNotification.createdAt
        });
      }
    }

    return res.status(200).json({ message: "Comment added" });

  } catch (error) {
    res.status(500).json({ message: "Error commenting", error: error.message });
  }
    }, getComments: async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await Post.findById(postId).populate("comment.userId", "userName profilePic");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
      }
    return res.status(200).json({ comments: post.comment });
  } catch (error) {
    res.status(500).json({ message: "Error getting comments", error: error.message });
  }
    },

    deleteComment: async (req, res) => {
  try {
    const userId = req.userID;
    const postId = req.params.postId;
    const commentId = req.params.commentId;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comment.find(comment => comment._id.toString() === commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.userId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    post.comment = post.comment.filter(
  (c) => c._id.toString() !== commentId
);

      await post.save();
      
      global.io.emit("deleteComment", {
  postId,
  commentId
});

    return res.status(200).json({ message: "Comment deleted successfully"});
  } catch (error) {
    res.status(500).json({ message: "Error deleting comment", error: error.message });
  }
    }, 
    updateComment: async (req, res) => {
  try {
    const userId = req.userID;
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    const { text } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comment.find(comment => comment._id.toString() === commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.userId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    comment.text = text;

    await post.save();

    return res.status(200).json({ message: "Comment updated successfully"});
  } catch (error) {
    res.status(500).json({ message: "Error updating comment", error: error.message });
  }
    }
    

}

module.exports = postController;