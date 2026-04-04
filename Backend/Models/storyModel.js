const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auth",
  },
  media: {
    type: String, // image/video URL
  },
  text: {
    type: String,
  },
  mediaType: {
    type: String, // "image" | "video" | "text"
  },
  expiresAt: {
    type: Date,
  }
}, { timestamps: true });

module.exports = mongoose.model("Story", storySchema, "Stories");

