const express = require("express");
const router = express.Router();
const {
  createPickup,
  getGarbageCollectorPickups,
  getGarbageCollectorPickupHistory,
  updatePickupStatus,
} = require("../controllers/pickup.controller");
const authMiddleware = require("../middleware/authMiddleware");

// Routes
router.post("/", authMiddleware, createPickup);
router.get("/", authMiddleware, getGarbageCollectorPickups);
router.get("/history", authMiddleware, getGarbageCollectorPickupHistory);
router.put("/:pickupId/status", authMiddleware, updatePickupStatus);

module.exports = router;