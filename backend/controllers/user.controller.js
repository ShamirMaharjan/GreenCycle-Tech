const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

exports.register = async (req, res) => {
  let { name, email, phoneNumber, address, password, role } = req.body;

  if (!name || !email || !phoneNumber || !address || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  email = email.toLowerCase();

  if (!["User", "garbageCollector", "admin"].includes(role)) {
    return res.status(400).json({ message: "Invalid role selected" });
  }

  if (role === "admin") {
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      return res.status(400).json({ message: "Only one admin is allowed" });
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{7,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message: "Password must be at least 7 characters long and contain at least one special character",
    });
  }

  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(phoneNumber)) {
    return res.status(400).json({ message: "Phone number must be exactly 10 digits" });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (existingUser) {
      return res.status(400).json({ message: "Email or Phone Number already exists" });
    }

    const newUser = new User({ name, email, phoneNumber, address, password, role });
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ message: "Error registering user" });
  }
};

exports.login = async (req, res) => {
  let { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password" });
  }

  email = email.toLowerCase();

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Error logging in" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

exports.deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: `User ${deletedUser.name} deleted successfully` });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user" });
  }
};
