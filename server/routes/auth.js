const router = require("express").Router();
const admin = require("../config/firebase.config");
const user = require("../models/user");

router.get("/login", async (req, res) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "No authorization header sent" });
  }

  const token = req.headers.authorization.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    if (!decodedToken) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // check if user exists in the database
    const existingUser = await user.findOne({ user_id: decodedToken.uid });
    if (!existingUser) {
      newUserData(decodedToken, req, res);
    } else {
      updateUser(decodedToken, req, res);
    }
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

const newUserData = async (decodedToken, req, res) => {
  const newUser = new user({
    username: decodedToken.name,
    email: decodedToken.email,
    password: "password",
    imageURL: decodedToken.picture,
    user_id: decodedToken.uid,
    email_verified: decodedToken.email_verified,
    auth_time: decodedToken.auth_time,
  });

    try {
        const savedUser = await newUser.save();
        res.status(200).send({ message: "User created successfully", user: savedUser });
    } catch (error) {
        res.status(400).send({ message: "Error creating user", error });
    }
};

const updateUser = async (decodedToken, req, res) => {
  try {
    const updatedUser = await user.findOneAndUpdate(
      { user_id: decodedToken.uid },
      {
        username: decodedToken.name,
        email: decodedToken.email,
        imageURL: decodedToken.picture,
        email_verified: decodedToken.email_verified,
        auth_time: decodedToken.auth_time,
      },
      { new: true }
    );
    res.status(200).send({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(400).send({ message: "Error updating user", error });
  }
};

module.exports = router;
// This is the route file for user authentication. It contains two routes, one for registering a user and the other for logging in. The routes are exported so that they can be used in the main server file.
//
