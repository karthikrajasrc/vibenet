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
    }
}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema, "Posts");