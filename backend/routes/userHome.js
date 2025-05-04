const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const userProfileController = require("../controllers/userProfile.controller");
const notificationController = require("../controllers/notification.controller");
const userScheduleController = require("../controllers/userSchedule.controller");
const historyController = require("../controllers/history.controller");
const rewardController = require("../controllers/reward.controller");

// User Profile Routes
router.get("/profile", authMiddleware, userProfileController.getUserProfile);
router.put("/profile", authMiddleware, userProfileController.updateUserProfile);

// Notification Routes
router.get("/notifications", authMiddleware, notificationController.getUserNotifications);

// User Schedule Routes
router.get("/schedules", authMiddleware, userScheduleController.getUserSchedules);

// History Routes
router.get("/history", authMiddleware, historyController.getUserHistory);

// Reward Routes
router.get("/rewards", authMiddleware, rewardController.getUserRewards);

module.exports = router;