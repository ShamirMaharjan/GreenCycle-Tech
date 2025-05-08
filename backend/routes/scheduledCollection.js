const express = require("express");
const router = express.Router();
const {
  addScheduledCollection,
  getRemainders,
  getPendingRequests,
  assignCollector,
  updateStatus,
  getUserHistory,
  getAssignedCollections,
  getTaskById,
  getGarbageCollectors,
  getCollectorHistory,
  deletePendingTask 
} = require("../controllers/scheduledCollection");

const authMiddleware = require("../middleware/authMiddleware");

const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role?.toLowerCase() !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
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
router.get("/collectors", authMiddleware, adminMiddleware, getGarbageCollectors); // Optional route

// -----------------------
// 🚛 Garbage Collector routes
// -----------------------
router.put("/:id/status", authMiddleware, updateStatus);
router.get("/gc/assigned", authMiddleware, getAssignedCollections);
router.get("/gc/task/:id", authMiddleware, getTaskById);
router.get("/gc/history", authMiddleware, getCollectorHistory); // Optional GC history
router.delete("/:id", authMiddleware, deletePendingTask); // ✅ Delete pending task


module.exports = router;
