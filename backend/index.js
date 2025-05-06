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

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:5173',  // Allow only your frontend origin
  credentials: true,  // Allow cookies and credentials
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload({
  createParentPath: true,
  limits: { fileSize: 5 * 1024 * 1024 },
  abortOnLimit: true,
  useTempFiles: false,
}));

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "uploads/verification");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve static files
app.use("/uploads", express.static(uploadDir));

// Payment routes
app.post("/initiate-payment", EsewaInitiatePayment);
app.post("/payment-status", paymentStatus);

// API Routes
app.use("/api/users", require("./routes/user"));
app.use("/api/articles", require("./routes/articles"));
app.use("/api/notices", require("./routes/notice"));
app.use("/api/collections", require("./routes/scheduledCollection")); // ✅ scheduled routes

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", dbStatus: mongoose.connection.readyState });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

// Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
