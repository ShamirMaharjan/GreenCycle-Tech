const Notice = require("../models/notice");
const User = require("../models/user");

// Add a new notice
exports.addNotice = async (req, res) => {
  const { title, description, category } = req.body;

  if (!title || !description || !category) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!["all", "client", "garbageCollector"].includes(category)) {
    return res.status(400).json({ message: "Invalid category selected" });
  }

  try {
    // Save notice to database
    const newNotice = new Notice({ title, description, category });
    await newNotice.save();

    // Find recipients based on category
    let recipients;
    if (category === "all") {
      recipients = await User.find({}, "email"); // All users
    } else {
      recipients = await User.find({ role: category }, "email"); // Specific role
    }

    const recipientEmails = recipients.map(user => user.email);
    res.status(201).json({ 
      message: `Notice sent successfully to ${recipientEmails.length} recipient(s)`, 
      recipients: recipientEmails 
    });

  } catch (err) {
    res.status(500).json({ message: "Error adding notice" });
  }
};

// Fetch all notices
exports.getNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.status(200).json(notices);
  } catch (err) {
    res.status(500).json({ message: "Error fetching notices" });
  }
};
