const express = require("express");
const router = express.Router();
const Notice = require("../models/Notice");

// Fetch all notices
router.get("/", async (req, res) => {
  try {
    const notices = await Notice.find();
    res.status(200).json(notices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching notices" });
  }
});

// Create a new notice
router.post("/", async (req, res) => {
  try {
    const { title, description, category } = req.body;

    const newNotice = new Notice({
      title,
      description,
      category,
      createdAt: new Date(),
    });

    await newNotice.save();
    res.status(201).json({ success: true, notice: newNotice });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error creating notice" });
  }
});

// Delete a notice by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const notice = await Notice.findByIdAndDelete(id);

    if (!notice) {
      return res.status(404).json({ success: false, message: "Notice not found" });
    }

    res.status(200).json({ success: true, message: "Notice deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error deleting notice" });
  }
});


// GET /api/notices/:category
router.get("/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const notices = await Notice.find({
      $or: [{ category }, { category: "All" }],
    }).sort({ createdAt: -1 });

    res.status(200).json(notices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching notices" });
  }
});



module.exports = router;