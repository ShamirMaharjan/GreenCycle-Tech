const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const path = require("path");
const fs = require("fs");
const { promisify } = require("util");
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);
require("dotenv").config();

// Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];
const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY || "1h";

// Helper functions
const ensureDirectoryExists = async (dirPath) => {
  try {
    await fs.promises.mkdir(dirPath, { recursive: true });
  } catch (err) {
    throw new Error(`Failed to create directory: ${err.message}`);
  }
};

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = (password) => /^(?=.*[!@#$%^&*(),.?":{}|<>]).{7,}$/.test(password);
const validatePhoneNumber = (phoneNumber) => /^\d{10}$/.test(phoneNumber);

// Registration controller
async function register(req, res) {
  try {
    let { name, email, phoneNumber, address, password, role, vehicleNumber, collectionArea, licenseNumber } = req.body;

    const requiredFields = ['name', 'email', 'phoneNumber', 'address', 'password', 'role'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({ success: false, message: `Missing required fields: ${missingFields.join(', ')}` });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ success: false, message: "Password must be at least 7 characters with a special character" });
    }

    if (!validatePhoneNumber(phoneNumber)) {
      return res.status(400).json({ success: false, message: "Phone number must be 10 digits" });
    }

    if (role === "garbageCollector" && (!vehicleNumber || !collectionArea || !licenseNumber)) {
      return res.status(400).json({ success: false, message: "Vehicle number, collection area, and license number are required for garbage collectors" });
    }

    email = email.toLowerCase();
    const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email or phone number already exists" });
    }

    if (role === "admin") {
      const existingAdmin = await User.findOne({ role: "admin" });
      if (existingAdmin) {
        return res.status(400).json({ success: false, message: "Only one admin is allowed" });
      }
    }

    const newUser = new User({
      name,
      email,
      phoneNumber,
      address,
      password,
      role,
      ...(role === "garbageCollector" && {
        vehicleNumber,
        collectionArea,
        licenseNumber,
        isVerified: false
      })
    });

    const savedUser = await newUser.save();
    const token = jwt.sign(
      { userId: savedUser._id, role: savedUser.role },
      process.env.JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        ...(role === "garbageCollector" && {
          isVerified: savedUser.isVerified
        })
      }
    });

  } catch (err) {
    console.error("Registration Error:", err);
    return res.status(500).json({ success: false, message: "Internal server error during registration" });
  }
}

// Login controller
async function login(req, res) {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    email = email.toLowerCase();
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    if (user.role === 'garbageCollector' && !user.isVerified) {
      return res.status(403).json({ success: false, message: "Account pending verification. Please contact admin." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        ...(user.role === "garbageCollector" && {
          isVerified: user.isVerified
        })
      }
    });

  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ success: false, message: "Internal server error during login" });
  }
}

// Upload verification image (Step 3)
async function uploadVerification(req, res) {
  try {
    const uploadDir = path.join(__dirname, '../uploads/verification');
    await ensureDirectoryExists(uploadDir);

    if (!req.files?.verificationImage) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }

    const { verificationImage } = req.files;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    if (!ALLOWED_FILE_TYPES.includes(verificationImage.mimetype)) {
      return res.status(400).json({ success: false, message: "Only JPEG/JPG/PNG images allowed" });
    }

    if (verificationImage.size > MAX_FILE_SIZE) {
      return res.status(400).json({ success: false, message: "Image size exceeds 5MB limit" });
    }

    const fileExt = path.extname(verificationImage.name);
    const fileName = `verification_${userId}_${Date.now()}${fileExt}`;
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, verificationImage.data);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { verificationImage: `/uploads/verification/${fileName}` },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      await unlink(filePath);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Verification image uploaded successfully",
      user: updatedUser
    });

  } catch (err) {
    console.error("Image Upload Error:", err);
    return res.status(500).json({ success: false, message: "Failed to upload verification image" });
  }
}

// Verify collector
async function verifyCollector(req, res) {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (typeof status !== 'boolean') {
      return res.status(400).json({ success: false, message: "Invalid verification status" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { isVerified: status },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.role !== 'garbageCollector') {
      return res.status(400).json({ success: false, message: "Only garbage collectors can be verified" });
    }

    return res.status(200).json({
      success: true,
      message: `Garbage collector ${status ? 'verified' : 'unverified'} successfully`,
      user
    });

  } catch (err) {
    console.error("Verification Error:", err);
    return res.status(500).json({ success: false, message: "Failed to update verification status" });
  }
}

// Get all users
async function getAllUsers(req, res) {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    console.error("Get Users Error:", err);
    res.status(500).json({ success: false, message: "Error fetching users" });
  }
}

// Get unverified garbage collectors
async function getUnverifiedCollectors(req, res) {
  try {
    const collectors = await User.find({ role: 'garbageCollector', isVerified: false }).select("-password");
    res.status(200).json({ success: true, data: collectors });
  } catch (err) {
    console.error("Get Unverified Collectors Error:", err);
    res.status(500).json({ success: false, message: "Error fetching unverified collectors" });
  }
}

// Delete user
async function deleteUser(req, res) {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Delete verification image if it exists
    if (user.verificationImage) {
      const imagePath = path.join(__dirname, "..", user.verificationImage);
      try {
        await unlink(imagePath);
      } catch (err) {
        console.warn("Could not delete verification image:", err.message);
      }
    }

    await user.deleteOne();

    return res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });

  } catch (err) {
    console.error("Delete User Error:", err);
    return res.status(500).json({ success: false, message: "Error deleting user" });
  }
}

// Export controllers
module.exports = {
  register,
  login,
  uploadVerification,
  verifyCollector,
  getAllUsers,
  getUnverifiedCollectors,
  deleteUser
};
