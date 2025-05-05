const express = require("express");
const router = express.Router();
const {
  addScheduledCollection,
  getRemainders,
  getPendingRequests,
  assignCollector,
  updateStatus,
  getUserHistory,
  getAssignedCollections,  // ✅ New
  getTaskById              // ✅ New
} = require("../controllers/scheduledCollection");

const authMiddleware = require("../middleware/authMiddleware");

const adminMiddleware = (req, res, next) => {
  console.log("Running adminMiddleware");
  console.log("req.user:", req.user);

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: No user in request" });
  }

  if (req.user.role?.toLowerCase() !== "admin") {
    console.log("Access denied: role is not admin");
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  console.log("Access granted: Admin verified");
  next();
};

// -----------------------
// ✅ User routes
// -----------------------
router.post("/", authMiddleware, addScheduledCollection);
router.get("/remainders", authMiddleware, getRemainders);
router.get("/history", authMiddleware, getUserHistory);

// -----------------------
// 🔒 Admin routes
// -----------------------
router.get("/pending", authMiddleware, adminMiddleware, getPendingRequests);
router.put("/assign", authMiddleware, adminMiddleware, assignCollector);

// -----------------------
// 🚛 Collector route
// -----------------------
router.put("/:id/status", authMiddleware, updateStatus);
// 🚛 GC routes
router.get("/gc/assigned", authMiddleware, getAssignedCollections);
router.get("/gc/task/:id", authMiddleware, getTaskById);


module.exports = router;
