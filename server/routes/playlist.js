const router = require("express").Router();
const playlist = require("../models/playlist");
const playlistSong = require("../models/playlist-song");
const admin = require("../config/firebase.config");


router.post("/create", async (req, res) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ message: "No authorization header sent" });
    }

    const token = req.headers.authorization.split(" ")[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);

        if (!decodedToken) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        const newPlaylist = new playlist({
            user_id: decodedToken.uid,
            name: req.body.name,
            description: req.body.description,
            imageURL: req.body.imageURL,
        });

        try {
            const savedPlaylist = await newPlaylist.save();
            res
                .status(200)
                .send({ message: "Playlist created successfully", playlist: savedPlaylist });
        } catch (error) {
            res.status(400).send({ message: "Error creating playlist", error });
        }
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
});

router.get("/get", async (req, res) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ message: "No authorization header sent" });
    }

    const token = req.headers.authorization.split(" ")[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);

        if (!decodedToken) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        const playlists = await playlist.find({ user_id: decodedToken.uid });

        res.status(200).send({ playlists });
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
});

router.post("/addSong", async (req, res) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ message: "No authorization header sent" });
    }

    const token = req.headers.authorization.split(" ")[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);

        if (!decodedToken) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        const newPlaylistSong = new playlistSong({
            playlist_id: req.body.playlist_id,
            song_id: req.body.song_id,
        });

        try {
            const savedPlaylistSong = await newPlaylistSong.save();
            res
                .status(200)
                .send({ message: "Song added to playlist successfully", playlistSong: savedPlaylistSong });
        } catch (error) {
            res.status(400).send({ message: "Error adding song to playlist", error });
        }
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
});


router.get("/getByUserId", async (req, res) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ message: "No authorization header sent" });
    }

    const token = req.headers.authorization.split(" ")[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);

        if (!decodedToken) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        const playlists = await playlist.find({ user_id: req.query.user_id });

        res.status(200).send({ playlists });
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
});

router.get("/getSongs", async (req, res) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ message: "No authorization header sent" });
    }

    const token = req.headers.authorization.split(" ")[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);

        if (!decodedToken) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        const playlistSongs = await playlistSong.find({ playlist_id: req.query.playlist_id });

        res.status(200).send({ playlistSongs });
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
});

router.delete("/deleteSong", async (req, res) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ message: "No authorization header sent" });
    }

    const token = req.headers.authorization.split(" ")[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);

        if (!decodedToken) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        const { playlist_id, song_id } = req.query;

        try {
            await playlistSong.deleteOne({ playlist_id, song_id });
            res.status(200).send({ message: "Song deleted from playlist successfully" });
        } catch (error) {
            res.status(400).send({ message: "Error deleting song from playlist", error });
        }
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
});

router.delete("/delete", async (req, res) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ message: "No authorization header sent" });
    }

    const token = req.headers.authorization.split(" ")[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);

        if (!decodedToken) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        try {
            await playlist.deleteOne({ _id: req.query.playlist_id });
            await playlistSong.deleteMany({ playlist_id: req.query.playlist_id });
            res.status(200).send({ message: "Playlist deleted successfully" });
        } catch (error) {
            res.status(400).send({ message: "Error deleting playlist", error });
        }
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
});


module.exports = router;
