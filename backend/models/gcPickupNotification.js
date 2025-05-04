const mongoose = require("mongoose");

const gcPickupNotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: String,
  message: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("GCPickupNotification", gcPickupNotificationSchema);
