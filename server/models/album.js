const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    artist:{
        type: String,
        required: true
    },
    releaseDate:{
        type: Date,
        required: true
    },
    genre:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    number_of_tracks:{
        type: Number,
        required: true
    },
    duration:{
        type: Number,
        required: true
    },
    coverArtURL:{
        type: String,
        required: true
    },
    },
    {
        timestamps: true
    });

module.exports = mongoose.model('Album', albumSchema);