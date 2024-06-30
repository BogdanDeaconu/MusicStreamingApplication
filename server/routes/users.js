const router = require("express").Router();
const mongoose = require('mongoose');

const User = require("../models/user");

// GET ALL USERS
router.get("/getAll", async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// CHANGE USER ROLE INTO ADMIN OR USER
router.put("/changeRole/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.role = user.role === "user" ? "admin" : "user";

    await user.save();
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error occurred while updating user role:", error);
    return res.status(500).json({
      error: "An error occurred while updating the user role",
      details: error.message,
    });
  }
});

module.exports = router;

// GET USER BY ID
router.get("/get/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
