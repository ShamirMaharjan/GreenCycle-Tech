const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    details: { type: String },
    createdAt: { type: Date, default: Date.now },
  }
);

const History = mongoose.model("History", historySchema);
module.exports = History;