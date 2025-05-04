const express = require("express");
const {
  addScheduledCollection,
  getCollectionsByDate,
  updatePickupStatus,
  assignCollector,
} = require("../controllers/scheduledCollection");
const authMiddleware = require("../middleware/authMiddleware"); // Import auth middleware

const router = express.Router();

// User routes
router.post("/add", authMiddleware, addScheduledCollection);  // User must be authenticated to add a collection

// Admin route to assign GC
router.post("/assign", authMiddleware, assignCollector);  // Admin must be authenticated to assign collector

// GC route to view collections for a date
router.get("/by-date", authMiddleware, getCollectionsByDate);  // GC must be authenticated to view collections by date

// GC updates pickup status
router.patch("/update-status/:id", authMiddleware, updatePickupStatus);  // GC must be authenticated to update status

module.exports = router;
