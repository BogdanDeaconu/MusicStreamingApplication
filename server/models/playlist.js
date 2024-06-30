const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema(
    {
        user_id: {
        type: String,
        ref: "User",
        required: true,
        },
        name: {
        type: String,
        required: true,
        },
        description: {
        type: String,
        required: true,
        },
        imageURL: {
        type: String,
        required: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Playlist", playlistSchema);
