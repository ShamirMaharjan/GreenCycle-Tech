const Pickup = require("../models/pickup");

// Create a new pickup request
exports.createPickup = async (req, res) => {
  try {
    const { date, location, client, notes } = req.body;
    const collector = req.user._id; // Get the garbage collector's ID from the authenticated user

    const newPickup = new Pickup({ date, location, client, collector, notes });
    await newPickup.save();

    res.status(201).json({ message: "Pickup request created successfully", pickup: newPickup });
  } catch (err) {
    res.status(500).json({ message: "Error creating pickup request", error: err.message });
  }
};

// Get all pickups for a garbage collector
exports.getGarbageCollectorPickups = async (req, res) => {
  try {
    const pickups = await Pickup.find({ collector: req.user._id }).sort({ date: 1 });
    res.status(200).json(pickups);
  } catch (err) {
    res.status(500).json({ message: "Error fetching pickups", error: err.message });
  }
};

// Get pickup history for a garbage collector
exports.getGarbageCollectorPickupHistory = async (req, res) => {
  try {
    const pickups = await Pickup.find({ collector: req.user._id, status: "completed" }).sort({ date: -1 });
    res.status(200).json(pickups);
  } catch (err) {
    res.status(500).json({ message: "Error fetching pickup history", error: err.message });
  }
};

// Update pickup status
exports.updatePickupStatus = async (req, res) => {
  try {
    const { pickupId } = req.params;
    const { status } = req.body;

    const updatedPickup = await Pickup.findByIdAndUpdate(pickupId, { status }, { new: true });
    if (!updatedPickup) {
      return res.status(404).json({ message: "Pickup not found" });
    }

    res.status(200).json({ message: "Pickup status updated successfully", pickup: updatedPickup });
  } catch (err) {
    res.status(500).json({ message: "Error updating pickup status", error: err.message });
  }
};