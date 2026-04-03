const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auth",
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auth",
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  type: {
    type: String,
    enum: ["like", "comment", "follow"],
  }
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema, "Notifications");