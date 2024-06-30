require("dotenv").config();
const express = require("express");
const app = express();

const cors = require("cors");
const { default: mongoose } = require("mongoose");

app.use(cors({origin: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the server");
});

// user autgentication route
const userRoute = require("./routes/auth");
app.use("/api/auth/", userRoute);

//users route
const usersRoute = require("./routes/users");
app.use("/api/users/", usersRoute);

// album route
const albumRoute = require("./routes/albums");
app.use("/api/album/", albumRoute);

// artist route
const artistRoute = require("./routes/artists");
app.use("/api/artist/", artistRoute);

// song route
const songRoute = require("./routes/songs");
app.use("/api/song/", songRoute);

// like route
const likeRoute = require("./routes/likes");
app.use("/api/likes/", likeRoute);

// playlist route
const playlistRoute = require("./routes/playlist");
app.use("/api/playlist/", playlistRoute);

mongoose
  .connect(process.env.MONGO_URI)
  .then((result) => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
