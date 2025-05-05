const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const bodyParser = require("body-parser");
const { EsewaInitiatePayment, paymentStatus } = require("./controllers/esewa.controller.js");


// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(fileUpload({
  createParentPath: true,
  limits: { fileSize: 5 * 1024 * 1024 },
  abortOnLimit: true,
  useTempFiles: false
}));

// Ensure upload directory exists
const uploadDir = path.join(__dirname, 'uploads/verification');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Static files
app.use("/uploads", express.static(uploadDir));

//esewa payment routes
app.post("/initiate-payment", EsewaInitiatePayment);
app.post("/payment-status", paymentStatus);

// Routes
app.use("/api/users", require("./routes/user"));
app.use("/api/articles", require("./routes/articles"));
app.use("/api/pickups", require("./routes/pickup"));
app.use("/api/user-home", require("./routes/userHome"));
app.use("/api/notices", require("./routes/notice"));
app.use("/api/scheduledCollection", require("./routes/scheduledCollection"));

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", dbStatus: mongoose.connection.readyState });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});