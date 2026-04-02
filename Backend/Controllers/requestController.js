const Auth = require("../Models/authModel");

const requestController = {
  sendRequest: async (req, res) => {
    try {
      const senderId = req.userID;
      const receiverId = req.params.id;

      if (senderId === receiverId) {
        return res.status(400).json({ message: "You can't send request to yourself" });
      }

      const receiver = await Auth.findById(receiverId);

      if (!receiver) {
        return res.status(404).json({ message: "User not found" });
      }

      if (receiver.friends.includes(senderId)) {
        return res.status(400).json({ message: "Already friends" });
      }

      const alreadyRequested = receiver.friendRequests.find(
        req => req.from.toString() === senderId
      );

      if (alreadyRequested) {
        return res.status(400).json({ message: "Request already sent" });
      }

      receiver.friendRequests.push({ from: senderId });

      await receiver.save();

      res.json({ message: "Request Sent" });

    } catch (error) {
      res.status(500).json({ message: "Error sending request", error: error.message });
    }
    }, 
    AcceptRequest: async (req, res) => {
        try {
        const userId = req.userID;
    const senderId = req.params.id;

    const user = await Auth.findById(userId);
    const sender = await Auth.findById(senderId);

    if (!user || !sender) {
      return res.status(404).json({ message: "User not found" });
    }

    const requestExists = user.friendRequests.find(
  req => req.from && req.from.toString() === senderId
);

    if (!requestExists) {
      return res.status(400).json({ message: "No friend request found" });
    }

    if (user.friends.includes(senderId)) {
      return res.status(400).json({ message: "Already friends" });
    }

    user.friends.push(senderId);
    sender.friends.push(userId);

    // remove request
    user.friendRequests = user.friendRequests.filter(
      req => req.from.toString() !== senderId
    );

    await user.save();
    await sender.save();

    res.json({ message: "Friend Added" });
        }
        catch (error) {
            res.status(500).json({ message: "Error accepting request", error: error.message });
        }
    }, RejectRequest: async (req, res) => {
  try {
    const userId = req.userID;
    const senderId = req.params.id;

    const user = await Auth.findById(userId);

    user.friendRequests = user.friendRequests.filter(
      req => req.from.toString() !== senderId
    );

    await user.save();

    res.json({ message: "Request Rejected" });

  } catch (error) {
    res.status(500).json({ message: "Error rejecting request" });
  }
}, uploadProfile: async (req, res) => {
    try {
      const userId = req.userID;

      const profilePic = req.files["profilePic"]?.[0]?.path;
      const coverPic = req.files["coverPic"]?.[0]?.path;

      const user = await Auth.findById(userId);

      if (profilePic) user.profilePic = profilePic;
      if (coverPic) user.coverPic = coverPic;

      await user.save();

      res.json({
        message: "Uploaded successfully",
        user
      });

    } catch (error) {
      res.status(500).json({ message: "Upload failed" });
    }
  }, getFriends: async (req, res) => {
    try {
        const userId = req.userID;
        const user = await Auth.findById(userId).populate("friends", "userName profilePic name coverPic");

        return res.status(200).json({ friends: user.friends });
    }
    catch (error) {
        res.status(500).json({ message: "Error getting friends", error: error.message });
    }
}, updateProfile: async (req, res) => {
    try {
        const userId = req.userID;
        const { name, bio, location, website } = req.body;

        const user = await Auth.findById(userId);

        user.name = name;
        user.bio = bio;
        user.location = location;
        user.website = website;

        await user.save();

        return res.status(200).json({ message: "Profile updated successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error updating profile", error: error.message });
    }
}
};

module.exports = requestController;