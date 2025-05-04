const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String },
    points: { type: Number, required: true },
  }
);

const Reward = mongoose.model("Reward", rewardSchema);
module.exports = Reward;