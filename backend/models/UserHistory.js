const mongoose = require("mongoose");

const userHistorySchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  location: { 
    type: String, 
    required: true 
  },
  wasteType: String,
  date: { 
    type: Date, 
    default: Date.now 
  },
  status: {
    type: String,
    default: "Completed"
  }
});

module.exports = mongoose.model("UserHistory", userHistorySchema);