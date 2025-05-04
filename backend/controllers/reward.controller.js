const Reward = require("../models/reward");

// Get user rewards
exports.getUserRewards = async (req, res) => {
  try {
    const rewards = await Reward.find({ userId: req.user._id });
    res.status(200).json(rewards);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user rewards", error: err.message });
  }
};