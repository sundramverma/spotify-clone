import fs from "fs";
import path from "path";
import axios from "axios";
import ytdl from "ytdl-core";

export const downloadFile = async ({
  source,
  youtubeId,
  audioUrl,
  filePath,
  res,
  filename = "audio.mp3",
}) => {
  try {
    // 🔥 FORCE DOWNLOAD
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}"`
    );
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Accept-Ranges", "bytes");

    /* =========================
       1️⃣ YOUTUBE DOWNLOAD
    ========================= */
    if (source === "youtube" && youtubeId) {
      const youtubeUrl = youtubeId.startsWith("http")
        ? youtubeId
        : `https://www.youtube.com/watch?v=${youtubeId}`;

      const stream = ytdl(youtubeUrl, {
        filter: "audioonly",
        quality: "highestaudio",
        highWaterMark: 1 << 25,
      });

      stream.on("error", (err) => {
        console.error("❌ YouTube stream error:", err.message);
        if (!res.headersSent) {
          res.status(500).end("YouTube download failed");
        } else {
          res.end();
        }
      });

      stream.pipe(res);
      return;
    }

    /* =========================
       2️⃣ API SONG (REMOTE URL)
    ========================= */
    if (audioUrl && audioUrl.startsWith("http")) {
      const response = await axios.get(audioUrl, {
        responseType: "stream",
      });

      response.data.on("error", (err) => {
        console.error("❌ Remote audio error:", err.message);
        res.end();
      });

      response.data.pipe(res);
      return;
    }

    /* =========================
       3️⃣ LOCAL FILE
    ========================= */
    if (filePath) {
      const fullPath = path.resolve(filePath);

      if (!fs.existsSync(fullPath)) {
        return res.status(404).json({ message: "File not found" });
      }

      const fileStream = fs.createReadStream(fullPath);

      fileStream.on("error", (err) => {
        console.error("❌ File stream error:", err.message);
        res.end();
      });

      fileStream.pipe(res);
      return;
    }

    /* =========================
       ❌ INVALID REQUEST
    ========================= */
    return res.status(400).json({
      message: "Invalid download source",
    });
  } catch (err) {
    console.error("❌ Download error:", err.message);
    return res.status(500).json({
      message: "Download failed",
    });
  }
};