const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

// Routes
const userRoutes = require("./routes/user");
const articleRoutes = require("./routes/articles");
const pickupRoutes = require("./routes/pickup");
const userHomeRoutes = require("./routes/userHome");
const noticeRoutes = require("./routes/notice");
const scheduledCollectionRoutes = require("./routes/scheduledCollection");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/pickups", pickupRoutes);
app.use("/api/user-home", userHomeRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/scheduledCollection", scheduledCollectionRoutes);

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);  // Exit process if MongoDB connection fails
  }
};

connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
