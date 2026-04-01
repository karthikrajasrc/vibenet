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
    }
});

module.exports = mongoose.model("Auth", userScheema, "Users");