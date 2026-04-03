const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth",
        required: true
    },
    text: {
        type: String,
    },
    image: {
        type: String,
    },
    video: {
        type: String,
    }, 
    likes: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auth"
  }
],
    comment: [
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth"
    },
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }
]
}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema, "Posts");