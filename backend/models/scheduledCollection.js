const mongoose = require("mongoose");

const scheduledCollectionSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ["Booked", "Assigned", "Not Arrived", "On the Way", "Picked Up"],
    default: "Booked"
  },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  collectorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  clientName: String,
  clientPhone: String,
  clientAddress: String
}, { timestamps: true });

module.exports = mongoose.model("ScheduledCollection", scheduledCollectionSchema);