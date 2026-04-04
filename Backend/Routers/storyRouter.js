const storyRouter = require("express").Router();
const Story = require("../Models/storyModel");
const Auth = require("../Models/authModel");

// POST /story
storyRouter.post("/", async (req, res) => {
  try {
    console.log("REQ BODY:", req.body); // 🔥 ADD THIS

    const newStory = new Story({
      ...req.body,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    const saved = await newStory.save();

    console.log("SAVED:", saved); // 🔥 ADD THIS

    res.status(200).json(saved);
  } catch (err) {
    console.log("ERROR:", err); // 🔥 IMPORTANT
    res.status(500).json(err);
  }
});


storyRouter.get("/", async (req, res) => {
  try {
    const stories = await Story.find({
      expiresAt: { $gt: new Date() }
    }).populate("userId", "userName name profilePic");

    res.status(200).json(stories);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = storyRouter;