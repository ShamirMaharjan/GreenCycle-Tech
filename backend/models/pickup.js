const mongoose = require("mongoose");

const pickupSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    location: { type: String, required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the client
    collector: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the garbage collector
    status: { type: String, enum: ["pending", "completed", "cancelled"], default: "pending" },
    notes: { type: String },
  },
  { timestamps: true }
);

const Pickup = mongoose.model("Pickup", pickupSchema);
module.exports = Pickup;