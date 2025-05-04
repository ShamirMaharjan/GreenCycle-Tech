const History = require("../models/history");

// Get user history
exports.getUserHistory = async (req, res) => {
  try {
    const history = await History.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user history", error: err.message });
  }
};