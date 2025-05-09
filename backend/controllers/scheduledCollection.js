const ScheduledCollection = require("../models/scheduledCollection");
const UserHistory = require("../models/UserHistory");
const User = require("../models/user");
const nodemailer = require("nodemailer");

// Email transporter setup
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Helper function to send email notifications
const sendEmailNotification = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html
    });
  } catch (error) {
    console.error("Email notification error:", error);
  }
};

// User schedules a pickup
exports.addScheduledCollection = async (req, res) => {
  try {
    const { date, location, description, wasteType, priority, notes, estimatedTime } = req.body;
    const userId = req.user._id;

    // Validate date is in the future
    if (new Date(date) <= new Date()) {
      return res.status(400).json({ message: "Collection date must be in the future" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newCollection = new ScheduledCollection({
      date,
      location,
      description,
      wasteType,
      priority,
      notes,
      estimatedTime,
      clientId: userId,
      clientName: user.name,
      clientEmail: user.email,
      clientPhone: user.phoneNumber,
      clientAddress: user.address,
      status: "Pending"
    });

    await newCollection.save();

    // Send confirmation email to user
    await sendEmailNotification(
      user.email,
      "Collection Scheduled",
      `<h1>Your collection has been scheduled</h1>
       <p>Date: ${new Date(date).toLocaleDateString()}</p>
       <p>Location: ${location}</p>
       <p>Description: ${description}</p>
       <p>Status: Pending</p>`
    );

    res.status(201).json({ message: "Collection scheduled successfully", collection: newCollection });
  } catch (error) {
    console.error("Error scheduling collection:", error);
    res.status(500).json({ message: "Error scheduling collection", error: error.message });
  }
};

// Get user's pending tasks (reminders)
exports.getRemainders = async (req, res) => {
  try {
    const userId = req.user._id;
    const collections = await ScheduledCollection.find({
      clientId: userId,
      status: { $in: ["Pending", "Assigned", "Not Arrived", "On the Way"] },
      date: { $gte: new Date() }
    }).sort({ date: 1 });

    res.status(200).json({
      success: true,
      data: collections,
    });
  } catch (error) {
    console.error("Error fetching reminders:", error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching reminders", 
      error: error.message,
    });
  }
};

// Get user's completed pickups (history)
exports.getUserHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log("Fetching history for user:", userId);

    // Get both UserHistory entries and Picked Up collections
    const [historyEntries, pickedUpCollections] = await Promise.all([
      UserHistory.find({ userId }).sort({ date: -1 }),
      ScheduledCollection.find({
        clientId: userId,
        status: "Picked Up"
      }).sort({ date: -1 })
    ]);

    console.log("Found history entries:", historyEntries.length);
    console.log("Found picked up collections:", pickedUpCollections.length);

    // Combine and sort the results
    const combinedHistory = [
      ...historyEntries.map(entry => ({
        _id: entry._id,
        userId: entry.userId,
        location: entry.location,
        wasteType: entry.wasteType,
        date: entry.date,
        status: entry.status,
        description: entry.description,
        actualPickupTime: entry.actualPickupTime,
        clientName: entry.clientName,
        clientEmail: entry.clientEmail,
        clientPhone: entry.clientPhone,
        clientAddress: entry.clientAddress,
        collectorId: entry.collectorId,
        priority: entry.priority,
        notes: entry.notes,
        estimatedTime: entry.estimatedTime
      })),
      ...pickedUpCollections.map(collection => ({
        _id: collection._id,
        userId: collection.clientId,
        location: collection.location,
        wasteType: collection.wasteType,
        date: collection.date,
        status: "Completed",
        description: collection.description,
        actualPickupTime: collection.actualPickupTime,
        clientName: collection.clientName,
        clientEmail: collection.clientEmail,
        clientPhone: collection.clientPhone,
        clientAddress: collection.clientAddress,
        collectorId: collection.collectorId,
        priority: collection.priority,
        notes: collection.notes,
        estimatedTime: collection.estimatedTime
      }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    console.log("Total combined history entries:", combinedHistory.length);

    res.status(200).json({
      success: true,
      data: combinedHistory
    });
  } catch (error) {
    console.error("Error fetching user history:", error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching user history", 
      error: error.message 
    });
  }
};

// Admin views pending requests
exports.getPendingRequests = async (req, res) => {
  try {
    const collections = await ScheduledCollection.find({
      status: { $in: ["Pending", "Assigned"] }
    }).sort({ date: 1, priority: -1 });

    res.status(200).json(collections);
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    res.status(500).json({ message: "Error fetching pending requests", error: error.message });
  }
};

// Admin fetches Garbage Collectors list
exports.getGarbageCollectors = async (req, res) => {
  try {
    const collectors = await User.find({ 
      role: "garbageCollector", 
      isVerified: true 
    }).select("name email phoneNumber address pickups");

    res.status(200).json(collectors);
  } catch (error) {
    console.error("Error fetching garbage collectors:", error);
    res.status(500).json({ message: "Error fetching garbage collectors", error: error.message });
  }
};

// Admin assigns collector
exports.assignCollector = async (req, res) => {
  try {
    const { collectionId, collectorId } = req.body;

    const collection = await ScheduledCollection.findById(collectionId);
    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    const collector = await User.findById(collectorId);
    if (!collector || collector.role !== "garbageCollector") {
      return res.status(400).json({ message: "Invalid collector" });
    }

    // Store the previous collector's ID if it exists
    const previousCollectorId = collection.collectorId;

    // If there was a previous collector, send them a notification about the reassignment first
    if (previousCollectorId) {
      const previousCollector = await User.findById(previousCollectorId);
      if (previousCollector) {
        try {
          await sendEmailNotification(
            previousCollector.email,
            "Collection Reassigned",
            `<h1>Your collection has been reassigned</h1>
             <p>The following collection has been reassigned to another collector:</p>
             <p>Date: ${new Date(collection.date).toLocaleDateString()}</p>
             <p>Location: ${collection.location}</p>
             <p>Client: ${collection.clientName}</p>
             <p>This collection is no longer assigned to you.</p>`
          );
          console.log("Reassignment notification sent to previous collector:", previousCollector.email);
        } catch (emailError) {
          console.error("Error sending reassignment notification:", emailError);
        }
      }
    }

    // Update only the collector-related fields
    collection.collectorId = collectorId;
    collection.status = "Assigned";
    
    // Ensure we don't overwrite client information
    if (!collection.clientEmail) {
      const client = await User.findById(collection.clientId);
      if (client) {
        collection.clientEmail = client.email;
        collection.clientName = client.name;
        collection.clientPhone = client.phoneNumber;
        collection.clientAddress = client.address;
      }
    }

    await collection.save();

    // Try to send notifications to new collector and user
    try {
      // Send notification to new collector
      await sendEmailNotification(
        collector.email,
        "New Collection Assigned",
        `<h1>You have been assigned a new collection</h1>
         <p>Date: ${new Date(collection.date).toLocaleDateString()}</p>
         <p>Location: ${collection.location}</p>
         <p>Client: ${collection.clientName}</p>
         <p>Please check your dashboard for more details.</p>`
      );

      // Send notification to user
      await sendEmailNotification(
        collection.clientEmail,
        "Collector Assigned",
        `<h1>A collector has been assigned to your request</h1>
         <p>Date: ${new Date(collection.date).toLocaleDateString()}</p>
         <p>Location: ${collection.location}</p>
         <p>Collector: ${collector.name}</p>
         <p>You will be notified when the collection is completed.</p>`
      );
    } catch (emailError) {
      console.error("Error sending email notifications:", emailError);
      // Continue with the response even if email sending fails
    }

    res.status(200).json({ message: "Collector assigned successfully", collection });
  } catch (error) {
    console.error("Error assigning collector:", error);
    res.status(500).json({ message: "Error assigning collector", error: error.message });
  }
};

// Garbage Collector updates task status
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const collectorId = req.user._id;

    console.log("Updating status for collection:", id);
    console.log("New status:", status);
    console.log("Collector ID:", collectorId);

    const collection = await ScheduledCollection.findById(id);
    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    console.log("Found collection:", collection);

    if (collection.collectorId.toString() !== collectorId.toString()) {
      return res.status(403).json({ message: "Not authorized to update this collection" });
    }

    // Update the status
    collection.status = status;
    
    // If status is Picked Up, add to user history
    if (status === "Picked Up") {
      try {
        collection.actualPickupTime = new Date();
        
        console.log("Creating history entry for user:", collection.clientId);
        
        // Add to user history with all necessary fields
        const history = new UserHistory({
          userId: collection.clientId,
          location: collection.location,
          wasteType: collection.wasteType,
          date: collection.date,
          status: "Completed",
          description: collection.description,
          actualPickupTime: collection.actualPickupTime,
          clientName: collection.clientName,
          clientEmail: collection.clientEmail,
          clientPhone: collection.clientPhone,
          clientAddress: collection.clientAddress,
          collectorId: collection.collectorId,
          priority: collection.priority,
          notes: collection.notes,
          estimatedTime: collection.estimatedTime
        });

        console.log("History entry to be saved:", history);
        const savedHistory = await history.save();
        console.log("History entry saved successfully:", savedHistory);
      } catch (historyError) {
        console.error("Error creating history:", historyError);
        // Continue with the status update even if history creation fails
      }
    }

    // Save the collection status update
    await collection.save();
    console.log("Collection status updated successfully");

    // Try to send notification, but don't fail if it doesn't work
    try {
      await sendEmailNotification(
        collection.clientEmail,
        "Collection Status Updated",
        `<h1>Your collection status has been updated</h1>
         <p>Status: ${status}</p>
         <p>Date: ${new Date(collection.date).toLocaleDateString()}</p>
         <p>Location: ${collection.location}</p>`
      );
    } catch (emailError) {
      console.error("Error sending email notification:", emailError);
      // Continue with the response even if email fails
    }

    res.status(200).json({ 
      message: "Status updated successfully", 
      collection,
      historyCreated: status === "Picked Up"
    });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ 
      message: "Error updating status", 
      error: error.message,
      details: error.stack
    });
  }
};

// Garbage Collector gets assigned tasks
exports.getAssignedCollections = async (req, res) => {
  try {
    const collectorId = req.user._id;
    const collections = await ScheduledCollection.find({
      collectorId,
      status: { $in: ["Assigned", "Not Arrived", "On the Way", "Picked Up"] },
      date: { $gte: new Date() }
    }).sort({ date: 1, priority: -1 });

    res.status(200).json(collections);
  } catch (error) {
    console.error("Error fetching assigned collections:", error);
    res.status(500).json({ message: "Error fetching assigned collections", error: error.message });
  }
};

// GC: Get task details by ID
exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const collection = await ScheduledCollection.findById(id);
    
    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    res.status(200).json(collection);
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({ message: "Error fetching task", error: error.message });
  }
};

// GC: View completed pickups
exports.getCollectorHistory = async (req, res) => {
  try {
    const collectorId = req.user._id;
    const collections = await ScheduledCollection.find({
      collectorId,
      status: "Picked Up"
    }).sort({ date: -1 });

    res.status(200).json(collections);
  } catch (error) {
    console.error("Error fetching collector history:", error);
    res.status(500).json({ message: "Error fetching collector history", error: error.message });
  }
};

// Delete a scheduled task
exports.deletePendingTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    const collection = await ScheduledCollection.findById(id);
    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    // Allow admin to delete any collection
    if (userRole === "admin") {
      await ScheduledCollection.findByIdAndDelete(id);
      return res.status(200).json({ message: "Collection deleted successfully" });
    }

    // For non-admin users, only allow deletion of their own pending collections
    if (collection.clientId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this collection" });
    }

    if (collection.status !== "Pending") {
      return res.status(400).json({ message: "Can only delete pending collections" });
    }

    await ScheduledCollection.findByIdAndDelete(id);
    res.status(200).json({ message: "Collection deleted successfully" });
  } catch (error) {
    console.error("Error deleting collection:", error);
    res.status(500).json({ message: "Error deleting collection", error: error.message });
  }
};
