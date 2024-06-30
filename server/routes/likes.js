const router = require("express").Router();
const like = require("../models/like");
const admin = require("../config/firebase.config");

router.post("/like", async (req, res) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "No authorization header sent" });
  }

  const token = req.headers.authorization.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    if (!decodedToken) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const newLike = new like({
      user_id: decodedToken.uid,
      album_id: req.body.album_id,
      track_id: req.body.track_id,
    });

    try {
      const savedLike = await newLike.save();
      res
        .status(200)
        .send({ message: "Like created successfully", like: savedLike });
    } catch (error) {
      res.status(400).send({ message: "Error creating like", error });
    }
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

router.get("/likeStatus", async (req, res) => {
  if (!req.headers.authorization) {
    console.error('No authorization header received'); // Add this line for debugging
    return res.status(401).json({ message: "No authorization header sent" });
  }

  const token = req.headers.authorization.split(" ")[1];
  console.log('Received token:', token); // Add this line for debugging

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    if (!decodedToken) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const { albumId, trackId } = req.query;

    console.log('Received query params:', req.query); // Add this line for debugging

    const likeCondition = {
      user_id: decodedToken.uid,
    };

    if (albumId) {
      likeCondition.album_id = albumId;
    }
    if (trackId) {
      likeCondition.track_id = trackId;
    }

    const likeExists = await like.findOne(likeCondition);

    if (likeExists) {
      res.status(200).send({ message: "Like exists", liked: true });
    } else {
      res.status(200).send({ message: "Like does not exist", liked: false });
    }
  } catch (error) {
    console.error("Error verifying token:", error); // Add this line for debugging
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

router.get("/getLikedSongs", async (req, res) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "No authorization header sent" });
  }

  const token = req.headers.authorization.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    if (!decodedToken) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const likedSongs = await like.find({
      user_id: decodedToken.uid,
      track_id: { $exists: true },
    });

    res.status(200).send({ likedSongs });
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
});


router.delete("/like", async (req, res) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "No authorization header sent" });
  }

  const token = req.headers.authorization.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    if (!decodedToken) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const deletedLike = await like.findOneAndDelete({
      user_id: decodedToken.uid,
      album_id: req.body.album_id,
      track_id: req.body.track_id,
    });

    if (!deletedLike) {
      return res.status(404).json({ message: "Like not found" });
    }

    res
      .status(200)
      .send({ message: "Like deleted successfully", like: deletedLike });
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

module.exports = router;
// Compare this snippet from server/routes/albums.js:
