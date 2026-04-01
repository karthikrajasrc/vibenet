const mongoose = require('mongoose');
const userScheema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true,
    },
    passWord: {
        type: String,
        required: true
    },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "Auth" }],

    friendRequests: [
    {
      from: { type: mongoose.Schema.Types.ObjectId, ref: "Auth" },
      status: { type: String, default: "pending" }
    }
    ], 
    profilePic: {
  type: String,
  default: ""
},
coverPic: {
  type: String,
  default: ""
}
});

module.exports = mongoose.model("Auth", userScheema, "Users");