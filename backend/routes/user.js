const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getAllUsers,
  deleteUser,
  uploadVerification,
  verifyCollector,
  getUnverifiedCollectors
} = require("../controllers/user.controller");
const UserOPTVerification = require("../models/UserOPTVerification");
const fileUpload = require("express-fileupload");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/user");
const TempUser = require("../models/TempUser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendOTPVerificationEmail } = require("../controllers/user.controller");
// Configure file upload middleware
const uploadMiddleware = fileUpload({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  abortOnLimit: true,
  createParentPath: true // This option automatically creates the parent directories if they do not exist
});

// ----------------------
// ✅ Public Routes
// ----------------------
router.post("/register", register);
router.post("/login", login);


router.post("/verify-otp", async (req, res) => {
  try {
    const { tempUserId, otp } = req.body;

    // Validate input
    if (!tempUserId || !otp) {
      return res.status(400).json({
        success: false,
        message: "Temporary user ID and OTP are required"
      });
    }

    // 1. Find the temporary user
    const tempUser = await TempUser.findById(tempUserId);
    if (!tempUser) {
      return res.status(400).json({
        success: false,
        message: "Registration session expired or invalid. Please register again."
      });
    }

    // 2. Find OTP records
    const otpRecords = await UserOPTVerification.find({ userId: tempUserId });
    if (otpRecords.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No OTP found. Please request a new OTP."
      });
    }

    const { expiresAt, otp: hashedOtp } = otpRecords[0];

    // 3. Check if OTP has expired
    if (expiresAt < Date.now()) {
      await UserOPTVerification.deleteMany({ userId: tempUserId });
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP."
      });
    }

    // 4. Verify OTP
    const validOTP = await bcrypt.compare(otp, hashedOtp);
    if (!validOTP) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP. Please try again."
      });
    }

    // 5. Create the actual user
    const newUser = new User({
      name: tempUser.name,
      email: tempUser.email.toLowerCase(),
      phoneNumber: tempUser.phoneNumber,
      address: tempUser.address,
      password: tempUser.password, // Already hashed from temp user
      role: tempUser.role,
      ...(tempUser.role === "garbageCollector" && {
        vehicleNumber: tempUser.vehicleNumber,
        collectionArea: tempUser.collectionArea,
        licenseNumber: tempUser.licenseNumber,
        isVerified: false
      })
    });

    const savedUser = await newUser.save();

    // 6. Clean up temporary data
    await Promise.all([
      TempUser.deleteOne({ _id: tempUserId }),
      UserOPTVerification.deleteMany({ userId: tempUserId })
    ]);

    // 7. Generate JWT token
    const token = jwt.sign(
      { userId: savedUser._id, role: savedUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    // 8. Return success response
    return res.status(201).json({
      success: true,
      message: "Account verified and registered successfully",
      token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        ...(savedUser.role === "garbageCollector" && {
          isVerified: savedUser.isVerified
        })
      }
    });

  } catch (error) {
    console.error("OTP Verification Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during OTP verification",
      error: error.message
    });
  }
});


router.post("/resend-otp", async (req, res) => {
  try {
    // Destructure with case-insensitive fallback
    const {
      tempUserId,
      TempUserId,
      email
    } = req.body;

    // Use either tempUserId or TempUserId
    const effectiveTempUserId = tempUserId || TempUserId;

    if (!effectiveTempUserId || !email) {
      return res.status(400).json({
        success: false,
        message: "Temporary user ID and email are required",
        details: "Please provide both tempUserId and email fields"
      });
    }

    // Check if temp user exists
    const tempUser = await TempUser.findOne({
      _id: effectiveTempUserId,
      email: email.toLowerCase()
    });

    if (!tempUser) {
      return res.status(404).json({
        success: false,
        message: "Registration session not found",
        details: "No temporary user found with provided ID and email. Please start registration again."
      });
    }

    // Delete any existing OTPs
    await UserOPTVerification.deleteMany({ userId: effectiveTempUserId });

    // Send new OTP
    await sendOTPVerificationEmail({
      _id: effectiveTempUserId,
      email: tempUser.email
    });

    return res.status(200).json({
      success: true,
      message: "New OTP sent successfully",
      tempUserId: effectiveTempUserId
    });

  } catch (error) {
    console.error("Resend OTP Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to resend OTP",
      details: error.message,
      errorType: error.name
    });
  }
});

// ✅ Allow garbage collectors to upload verification without token
router.post("/upload-verification",
  uploadMiddleware, // Handle the file upload here
  uploadVerification
);

// ----------------------
// 🔒 Protected Routes
// ----------------------
router.get("/unverified-collectors", authMiddleware, getUnverifiedCollectors);
router.put("/verify-collector/:userId", authMiddleware, verifyCollector);
router.get("/all", authMiddleware, getAllUsers);
router.delete("/:userId", authMiddleware, deleteUser);

module.exports = router;
