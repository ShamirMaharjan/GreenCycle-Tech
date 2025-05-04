const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getAllUsers,
  deleteUser,
  uploadVerification,
  verifyCollector,
  getUnverifiedCollectors
} = require("../controllers/user.controller");
const fileUpload = require("express-fileupload");
const authMiddleware = require("../middleware/authMiddleware");

// Configure file upload middleware
const uploadMiddleware = fileUpload({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  abortOnLimit: true,
  createParentPath: true // This option automatically creates the parent directories if they do not exist
});

// ----------------------
// ✅ Public Routes
// ----------------------
router.post("/register", register);
router.post("/login", login);

// ✅ Allow garbage collectors to upload verification without token
router.post("/upload-verification", 
  uploadMiddleware, // Handle the file upload here
  uploadVerification
);

// ----------------------
// 🔒 Protected Routes
// ----------------------
router.get("/unverified-collectors", authMiddleware, getUnverifiedCollectors);
router.put("/verify-collector/:userId", authMiddleware, verifyCollector);
router.get("/", authMiddleware, getAllUsers);
router.get("/all", authMiddleware, getAllUsers);
router.delete("/:userId", authMiddleware, deleteUser);

module.exports = router;
