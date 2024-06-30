const router = require("express").Router();

const Songs = require("../models/song");

// GET ALL SONGS
router.get("/getAll", async (req, res) => {
  try {
    const songs = await Songs.find();
    return res.status(200).json(songs);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// SAVE SONG
router.post("/save", async (req, res) => {
  const { title, artist, category, image_url, credits, song_url, album, duration } = req.body;

  const newSong = new Songs({
    title,
    artist,
    category,
    image_url,
    song_url,
    views: 0,
    credits,
    album,
    duration,
  });

  try {
    const savedSong = await newSong.save();
    return res.status(200).json({ song: savedSong, success: true });
  } catch (error) {
    return res.status(500).json({ error: error, success: false });
  }
});

router.get("/getRandom", async (req, res) => {
  try {
    const songs = await Songs.aggregate([{ $sample: { size: 1 } }]);
    return res.status(200).json(songs);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// GET SONG BY ID
router.get("/getById/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const song = await Songs.findById(id);

    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    } else {
      return res.status(200).json(song);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

// UPDATE SONG
router.put("/update/:id", async (req, res) => {
  const filter = { _id: req.params.id };
  const {  title, artist, category, image_url, song_url, album, views } = req.body;
  const options = {
    upsert: true,
    new: true,
  };
  try {
    const result = await Songs.findOneAndUpdate(
      filter,
      {
        title,
        artist,
        category,
        image_url,
        song_url,
        views,
        album,
      },
      options
    );
    return res.status(200).json({ song: result, success: true });
  } catch (error) {
    return res.status(500).json({ error: error, success: false });
  }
});

// DELETE SONG
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Songs.findByIdAndDelete(id);
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error, success: false });
  }
});

// GET SONGS BY ALBUM
router.get("/getByAlbum/:album", async (req, res) => {
  const { album } = req.params;
  try {
    const songs = await Songs.find({ album: album });

    if (!songs) {
      return res.status(404).json({ message: "Songs not found" });
    } else {
      return res.status(200).json(songs);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});




module.exports = router;
