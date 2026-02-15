import express from "express";
import cors from "cors";
import "dotenv/config";
import path from "path";

import connectDB from "./src/config/mongodb.js";
import connectCloudinary from "./src/config/cloudinary.js";

import songRouter from "./src/routes/songRoute.js";
import albumRouter from "./src/routes/albumRoute.js";
import podcastRouter from "./src/routes/podcastRoute.js";
import youtubeRouter from "./src/routes/youtubeRoute.js";
import downloadRoute from "./src/routes/downloadRoute.js";

// 🔥 yt-dlp update warning disable
process.env.YTDL_NO_UPDATE = "1";

const app = express();
const port = process.env.PORT || 5000;

// =========================
// DB & Cloudinary
// =========================
connectDB();
connectCloudinary();

// =========================
// Middlewares
// =========================
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://sundram-spotify-clone.vercel.app",
    ],
    credentials: true,
  })
);

// =========================
// 📥 DOWNLOAD ROUTES
// =========================
app.use("/api/download", downloadRoute);

// =========================
// 🔊 STATIC AUDIO FILES
// =========================
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"), {
    setHeaders: (res, filePath) => {
      res.setHeader("Accept-Ranges", "bytes");

      if (filePath.endsWith(".mp3") || filePath.endsWith(".mpeg")) {
        res.setHeader("Content-Type", "audio/mpeg");
      }
      if (filePath.endsWith(".wav")) {
        res.setHeader("Content-Type", "audio/wav");
      }
    },
  })
);

// =========================
// 🔍 JioSaavn Proxy (FINAL – RENDER SAFE)
// =========================
app.get("/api/jiosaavn/search", async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.json({ success: false, data: { results: [] } });
  }

  try {
    const response = await fetch(
      `https://saavn.dev/api/search/songs?query=${encodeURIComponent(
        query
      )}&limit=20`
    );

    const json = await response.json();

    return res.json({
      success: true,
      data: {
        results: json?.data?.results || [],
      },
    });
  } catch (error) {
    console.error("❌ JioSaavn API error:", error.message);
    return res.json({ success: false, data: { results: [] } });
  }
});

// =========================
// API ROUTES
// =========================
app.use("/api/song", songRouter);
app.use("/api/album", albumRouter);
app.use("/api/podcast", podcastRouter);
app.use("/api/youtube", youtubeRouter);

// =========================
// HEALTH CHECK
// =========================
app.get("/", (req, res) => res.send("🚀 API Working"));

app.listen(port, () => {
  console.log(`🔥 Server running on port ${port}`);
});
