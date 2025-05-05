// routes/notice.js
const express = require("express");
const { addNotice, getNotices } = require("../controllers/notice.controller");
const router = express.Router();

// Add Notice (Admin Only)
router.post("/add", addNotice);

// Get All Notices
router.get("/", getNotices);

module.exports = router;