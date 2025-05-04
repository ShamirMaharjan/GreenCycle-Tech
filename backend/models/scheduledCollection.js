const mongoose = require("mongoose");

const scheduledCollectionSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "Booked", // "Booked", "Completed", "Not Arrived", "On the Way", "Picked Up"
  },
  collectorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assigned garbage collector
    default: null,
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Client who booked the pickup
    required: true,
  },
});

const ScheduledCollection = mongoose.model("ScheduledCollection", scheduledCollectionSchema);
module.exports = ScheduledCollection;
