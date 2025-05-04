const Notification = require("../models/notification");

// Get user notifications
exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Error fetching notifications", error: err.message });
  }
};