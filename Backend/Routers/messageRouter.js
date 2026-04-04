const Message = require("../Models/messageModel");
const router = require("express").Router();


router.post("/", async (req, res) => {
  try {
    const newMessage = new Message(req.body);
    const saved = await newMessage.save();
    res.status(200).json(saved);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.params.userId, receiverId: req.query.me },
        { senderId: req.query.me, receiverId: req.params.userId }
      ]
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;