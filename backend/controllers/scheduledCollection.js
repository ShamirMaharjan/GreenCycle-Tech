const ScheduledCollection = require("../models/scheduledCollection");
const UserHistory = require("../models/UserHistory");
const User = require("../models/User");

// User schedules a pickup
// User schedules a pickup
exports.addScheduledCollection = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const newCollection = new ScheduledCollection({
      ...req.body,
      clientId: user._id,
      clientName: user.name,
      clientPhone: user.phoneNumber, // Make sure to use `phoneNumber` here
      clientAddress: user.address,
      status: "Booked"
    });

    await newCollection.save();
    res.status(201).json({
      success: true,
      data: newCollection
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// Get user's pending tasks (reminders)
exports.getRemainders = async (req, res) => {
  try {
    const remainders = await ScheduledCollection.find({
      clientId: req.user._id,
      status: { $in: ["Booked", "Assigned", "Not Arrived", "On the Way"] }
    }).sort({ date: -1 });  // Sort by date descending (newest first)

    res.status(200).json({ success: true, data: remainders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// Get user's completed pickups (history)
exports.getUserHistory = async (req, res) => {
  try {
    const history = await UserHistory.find({ userId: req.user._id })
      .sort({ date: -1 });

    res.status(200).json({ success: true, data: history });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin views pending requests
exports.getPendingRequests = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    const requests = await ScheduledCollection.find({ status: "Booked" })
      .populate("clientId", "fullName email phone address");

    res.status(200).json({ success: true, data: requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin fetches Garbage Collectors list
exports.getGarbageCollectors = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    const collectors = await User.find({ role: "garbageCollector", isApproved: true })
      .select("fullName email phoneNo address pickups");

    res.status(200).json({ success: true, data: collectors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin assigns collector
exports.assignCollector = async (req, res) => {
  try {
    const { collectionId, collectorId } = req.body;

    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }

    const collection = await ScheduledCollection.findById(collectionId);
    if (!collection) {
      return res.status(404).json({ success: false, message: "Scheduled collection not found" });
    }

    if (collection.collectorId) {
      return res.status(400).json({ success: false, message: "Collector already assigned" });
    }

    await User.findByIdAndUpdate(collectorId, { $inc: { pickups: 1 } });

    const updatedCollection = await ScheduledCollection.findByIdAndUpdate(
      collectionId,
      { collectorId, status: "Assigned" },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Collector assigned successfully",
      data: updatedCollection
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Garbage Collector updates task status
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const validStatuses = ["Not Arrived", "On the Way", "Picked Up"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const collection = await ScheduledCollection.findOneAndUpdate(
      { _id: id, collectorId: req.user._id },
      { status },
      { new: true }
    );

    if (!collection) {
      return res.status(404).json({ success: false, message: "Collection not found or not assigned to you" });
    }

    if (status === "Picked Up") {
      await UserHistory.create({
        userId: collection.clientId,
        location: collection.location,
        wasteType: collection.description,
        date: collection.date
      });
    }

    res.status(200).json({ success: true, data: collection });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Garbage Collector gets assigned tasks
exports.getAssignedCollections = async (req, res) => {
  try {
    const tasks = await ScheduledCollection.find({
      collectorId: req.user._id,
      status: { $in: ["Assigned", "Not Arrived", "On the Way"] }
    }).sort({ date: 1 });

    res.status(200).json({ success: true, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GC: Get task details by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await ScheduledCollection.findOne({
      _id: req.params.id,
      collectorId: req.user._id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found or not assigned to you"
      });
    }

    res.status(200).json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// (Optional) GC: View completed pickups
exports.getCollectorHistory = async (req, res) => {
  try {
    const history = await ScheduledCollection.find({
      collectorId: req.user._id,
      status: "Picked Up"
    }).sort({ date: -1 });

    res.status(200).json({ success: true, data: history });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
