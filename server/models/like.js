const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
    {
        user_id: {
        type: String,
        ref: "User",
        required: true,
        },
        album_id: {
        type: String,
        ref: "Album",
        required: false,
        },
        track_id: {
        type: String,
        ref: "Track",
        required: false,
        },

    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Like", likeSchema);