const mongoose = require("mongoose");
const ScheduledCollection = require("../models/scheduledCollection");
const GCPickupNotification = require("../models/gcPickupNotification");

// Add a new scheduled collection (by user)
exports.addScheduledCollection = async (req, res) => {
  const { date, location, description } = req.body;

  if (!date || !location || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newScheduledCollection = new ScheduledCollection({
      date,
      location,
      description,
      status: "Booked",  // Set default status to "Booked"
      clientId: req.user._id, // Automatically set from logged-in user
    });

    await newScheduledCollection.save();
    res.status(201).json({
      message: "Scheduled collection added successfully",
      data: newScheduledCollection,
    });
  } catch (err) {
    res.status(500).json({ message: "Error adding scheduled collection", error: err.message });
  }
};

// Get scheduled collections by date (for garbage collectors)
exports.getCollectionsByDate = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date query is required" });
    }

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const collections = await ScheduledCollection.find({
      date: { $gte: start, $lte: end },
    });

    res.status(200).json(collections);
  } catch (err) {
    res.status(500).json({ message: "Error fetching collections for date", error: err.message });
  }
};

// Garbage Collector updates pickup status + notify user
exports.updatePickupStatus = async (req, res) => {
  try {
    const { id } = req.params; // Get collection ID from URL
    const { status } = req.body; // Get status from request body

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const schedule = await ScheduledCollection.findById(id);
    if (!schedule) {
      return res.status(404).json({ message: "Scheduled collection not found" });
    }

    // Update the pickup status
    schedule.status = status;
    await schedule.save();

    // Send notification to the user
    await GCPickupNotification.create({
      userId: schedule.clientId, // The client who booked the pickup
      title: "Pickup Status Updated",
      message: `Your pickup status has been updated to "${status}".`,
    });

    res.status(200).json({ message: "Status updated and user notified" });
  } catch (err) {
    res.status(500).json({ message: "Error updating status", error: err.message });
  }
};

// Admin assigns a garbage collector to a scheduled collection
exports.assignCollector = async (req, res) => {
  const { id, collectorId } = req.body;

  // Validate the collectorId and check if it's a valid ObjectId
  if (!collectorId || !mongoose.Types.ObjectId.isValid(collectorId)) {
    return res.status(400).json({ message: "Invalid or missing collectorId" });
  }

  try {
    const schedule = await ScheduledCollection.findById(id);
    if (!schedule) {
      return res.status(404).json({ message: "Scheduled collection not found" });
    }

    // Assign the garbage collector to the scheduled collection
    schedule.collectorId = collectorId;
    await schedule.save();

    res.status(200).json({ message: "Collector assigned successfully", data: schedule });
  } catch (err) {
    res.status(500).json({ message: "Error assigning collector", error: err.message });
  }
};
