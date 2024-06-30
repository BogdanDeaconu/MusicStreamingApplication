const router = require("express").Router();

const Albums = require("../models/album");

// GET ALL ALBUMS
router.get("/getAll", async (req, res) => {
  try {
    const albums = await Albums.find();
    return res.status(200).json(albums);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// SAVE ALBUM
router.post("/save", async (req, res) => {
  const { name, artist, releaseDate, number_of_tracks, duration, description, genre, coverArtURL } = req.body;

  const newAlbum = new Albums({
    name,
    artist,
    releaseDate,
    genre,
    description,
    number_of_tracks,
    duration,
    coverArtURL,
  });

  try {
    const savedAlbum = await newAlbum.save();
    return res.status(200).json({ album: savedAlbum, success: true });
  } catch (error) {
    return res.status(500).json({ error: error, success: false });
  }
});

// GET ALBUM BY ID
router.get("/getById/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const album = await Albums.findById(id);

    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    } else {
      return res.status(200).json(album);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

// GET ALBUM iD BY NAME
router.get("/getByName/:name", async (req, res) => {
  const { name } = req.params;
  try {
    const album = await Albums.findOne({ name: name });
    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    } else {
      return res.status(200).json(album._id);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

// UPDATE ALBUM
router.put("/update/:id", async (req, res) => {
  const filter = { _id: req.params.id };
  const { name, artist, releaseDate, number_of_tracks, description, duration, genre, coverArtURL } = req.body;
  const options = {
    upsert: true,
    new: true,
  };
  try {
    const result = await Albums.findOneAndUpdate(
      filter,
      {
        name,
        artist,
        releaseDate,
        genre,
        description,
        number_of_tracks,
        duration,
        coverArtURL,
      },
      options
    );
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// DELETE ALBUM
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const album = await Albums.findByIdAndDelete(id);
    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    } else {
      return res.status(200).json({ message: "Album deleted" });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

// GET ALBUMS BY ARTIST
router.get("/getByArtist/:artist", async (req, res) => {
  const { artist } = req.params;
  try {
    const albums = await Albums.find({ artist: artist });
    if (!albums) {
      return res.status(404).json({ message: "Albums not found" });
    } else {
      return res.status(200).json(albums);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
