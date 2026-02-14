import express from "express";
import { downloadFile } from "../utils/downloadFile.js";
import Song from "../models/Song.js";       // uploaded songs model
import Podcast from "../models/Podcast.js"; // uploaded podcasts model

const router = express.Router();

/* ================================
   🎵 DOWNLOAD YOUTUBE SONG
   URL: /api/download/youtube/:id
================================ */
router.get("/youtube/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await downloadFile({
      source: "youtube",
      youtubeId: id,
      res,
      filename: `youtube-${id}.mp3`,
    });
  } catch (err) {
    console.error("YouTube download error:", err);
    res.status(500).json({ message: "YouTube download failed" });
  }
});

/* ================================
   🎶 DOWNLOAD API SONG (REMOTE URL)
   URL: /api/download/api-song
   body: { audioUrl, name }
================================ */
router.post("/api-song", async (req, res) => {
  try {
    const { audioUrl, name } = req.body;

    if (!audioUrl) {
      return res.status(400).json({ message: "audioUrl required" });
    }

    await downloadFile({
      audioUrl,
      res,
      filename: `${name || "api-song"}.mp3`,
    });
  } catch (err) {
    console.error("API song download error:", err);
    res.status(500).json({ message: "API song download failed" });
  }
});

/* ================================
   📂 DOWNLOAD UPLOADED SONG
   URL: /api/download/song/:id
================================ */
router.get("/song/:id", async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    await downloadFile({
      filePath: song.file, // local path
      res,
      filename: `${song.name}.mp3`,
    });
  } catch (err) {
    console.error("Uploaded song download error:", err);
    res.status(500).json({ message: "Song download failed" });
  }
});

/* ================================
   🎙️ DOWNLOAD UPLOADED PODCAST
   URL: /api/download/podcast/:id
================================ */
router.get("/podcast/:id", async (req, res) => {
  try {
    const podcast = await Podcast.findById(req.params.id);
    if (!podcast) {
      return res.status(404).json({ message: "Podcast not found" });
    }

    await downloadFile({
      filePath: podcast.file,
      res,
      filename: `${podcast.name}.mp3`,
    });
  } catch (err) {
    console.error("Podcast download error:", err);
    res.status(500).json({ message: "Podcast download failed" });
  }
});

export default router;
