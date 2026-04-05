const mongoose = require("mongoose");
const app = require("./app");
require("dotenv").config();
const PORT = process.env.PORT || 5000;

const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const users = {};

const Message = require("./Models/messageModel");

const io = new Server(server, {
  cors: {
    origin: process.env.BASE_URL,
    credentials: true
  },
});

global.io = io;

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("userOnline", (userId) => {
    users[userId] = socket.id;
  });

  socket.on("sendMessage", async ({ senderId, receiverId, text }) => {

  const newMessage = new Message({ senderId, receiverId, text });
  const savedMessage = await newMessage.save();

  const receiverSocketId = users[receiverId];

  if (receiverSocketId) {
    io.to(receiverSocketId).emit("getMessage", savedMessage);
  }
});

  socket.on("disconnect", () => {
    for (let id in users) {
      if (users[id] === socket.id) {
        delete users[id];
      }
    }
  });
});

global.users = users;
mongoose
  .connect(process.env.MONGOOSE_URL)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("DB Error:", error);
  });