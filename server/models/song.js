const mongoose = require("mongoose");

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    artist: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    image_url: {
      type: String,
      required: true,
    },
    song_url: {
      type: String,
      required: true,
    },
    album: {
      type: String,
    },
    views: {
      type: Number,
      default: 0,
    },
    credits: {
      type: String,
    },
    duration: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Song", songSchema);
