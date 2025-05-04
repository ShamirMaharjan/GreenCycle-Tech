const Pickup = require("../models/pickup");

// Get user schedules
exports.getUserSchedules = async (req, res) => {
  try {
    const pickups = await Pickup.find({ client: req.user._id }).sort({ date: 1 });
    res.status(200).json(pickups);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user schedules", error: err.message });
  }
};