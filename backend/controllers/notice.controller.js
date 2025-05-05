const Notice = require("../models/Notice");

// Create a new notice
exports.createNotice = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const newNotice = await Notice.create({ title, description, category });
    res.status(201).json(newNotice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create notice" });
  }
};

// Get the latest 10 notices, newest first
exports.getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find()
      .sort({ createdAt: -1 })  // newest first
      .limit(100);               // only 10 items
    res.status(200).json(notices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch notices" });
  }
};

// Get the latest 10 notices for a specific category (plus 'All')
exports.getNoticesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const notices = await Notice.find({
      $or: [
        { category: category },
        { category: "All" }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(10);
    res.status(200).json(notices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch notices by category" });
  }
};

// Delete a notice by ID
exports.deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Notice.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Notice not found" });
    }
    res.status(200).json({ message: "Notice deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete notice" });
  }
};

// Add this below your other routes
router.get("/:category", async (req, res) => {
  try {
    const { category } = req.params;

    const notices = await Notice.find({
      $or: [
        { category: category },
        { category: "All" },
      ],
    }).sort({ createdAt: -1 });

    // Limit to latest 10
    res.status(200).json(notices.slice(0, 10));
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching notices by category" });
  }
});

