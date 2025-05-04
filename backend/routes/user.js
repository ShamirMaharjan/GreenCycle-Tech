const express = require("express");
const {
  register,
  login,
  getAllUsers,
  deleteUser,
} = require("../controllers/user.controller");

const router = express.Router();

// Authentication routes
router.post("/register", register);
router.post("/login", login);

// Admin routes
router.get("/", getAllUsers);
router.get("/all", getAllUsers);
router.delete("/:userId", deleteUser);

module.exports = router;
