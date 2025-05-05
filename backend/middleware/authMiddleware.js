const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authMiddleware = async (req, res, next) => {
  // Extract token from Authorization header
  const token = req.header("Authorization")?.replace("Bearer ", "");

  // Debugging log: check if the token is being passed correctly
  console.log("Received Token:", token);

  if (!token) {
    return res.status(403).json({ message: "Access Denied. No token provided." });
  }

  try {
    // Verify token using JWT secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Debugging log: check the decoded token payload
    console.log("Decoded Token:", decoded);

    // Find the user by the decoded userId from the token
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach the user information to the request object
    req.user = user;

    // Debugging log: check if user information is properly attached
    console.log("Authenticated User:", req.user);

    // Proceed to the next middleware/controller
    next();
  } catch (err) {
    console.error("Error in authMiddleware:", err);
    return res.status(401).json({ message: "Unauthorized", error: err.message });
  }
};

module.exports = authMiddleware;
