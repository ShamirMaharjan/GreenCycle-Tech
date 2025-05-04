const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(403).json({ message: "Access Denied. No token provided." });
  }

  try {
    // Verify token using JWT secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find the user by the decoded userId from the token
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach the user information to the request object
    req.user = user; // This will be used to identify the user in the route/controller

    // Proceed to the next middleware/controller
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized", error: err.message });
  }
};

module.exports = authMiddleware;
