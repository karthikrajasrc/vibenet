const Notification = require("../Models/notificationModel")

const getNotifications = async (req, res) => {
  try {
    const userId = req.userID;

    const notifications = await Notification.find({ receiverId: userId })
      .populate("senderId", "userName profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json({ notifications });
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications", error: error.message });
  }
};

module.exports = { getNotifications };