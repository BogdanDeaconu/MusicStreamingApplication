const mongoose = require("mongoose");

const playlistSongSchema = new mongoose.Schema(
    {
        playlist_id: {
        type: String,
        ref: "Playlist",
        required: true,
        },
        song_id: {
        type: String,
        ref: "Song",
        required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("PlaylistSong", playlistSongSchema);