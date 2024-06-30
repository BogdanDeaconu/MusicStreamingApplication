const router = require("express").Router();

const Artist = require("../models/artist");

// GET ALL ARTISTS
router.get("/getAll", async (req, res) => {
  try {
    const artists = await Artist.find();
    return res.status(200).json(artists);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// SAVE ARTIST
router.post("/save", async (req, res) => {
  const { name, imageURL, bio, instagram, twitter } = req.body;

  const newArtist = new Artist({
    name,
    imageURL,
    bio,
    instagram,
    twitter,
  });

  try {
    const savedArtist = await newArtist.save();
    return res.status(200).json(savedArtist);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// GET ARTIST BY ID

router.get("/getById/:id", async (req, res) => {
  const { _id } = req.params;

  try {
    const artist = await Artist.findOne(_id);
    return res.status(200).json(artist);
  } catch (error) {
    return res.status(500).json(error);
  }
});


// GET ARTIST BY NAME

router.get("/getByName/:name", async (req, res) => {
  const { name } = req.params;

  try {
    const artist = await Artist.findOne({ name }); // Utilizați un obiect de interogare
    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }
    return res.status(200).json(artist);
  } catch (error) {
    console.error("Error fetching artist:", error); // Logare pentru debugging
    return res.status(500).json({ message: "Internal server error", error });
  }
});

// UPDATE ARTIST

router.put("/update/:id", async (req, res) => {
  const filter = { _id: req.params.updateId };
  const { name, imageURL, bio, instagram, twitter } = req.body;
  const options = {
    upsert: true,
    new: true,
  };
  try {
    const result = await Artist.findOneAndUpdate(
      filter,
      {
        name,
        imageURL,
        bio,
        instagram,
        twitter,
      },
      options
    );
    res.status(200).send({ artist: result });
  } catch (error) {
    res.status(400).send({ success: false, msg: error });
  }
});

// DELETE ARTIST

router.delete("/delete/:id", async (req, res) => {
  const filter = { _id: req.params.id };

  const result = await Artist.deleteOne(filter);

  if (result) {
    return res.status(200).json({ message: "Artist deleted successfully" });
  } else {
    return res.status(500).json({ message: "Error deleting artist" });
  }
});

module.exports = router;
