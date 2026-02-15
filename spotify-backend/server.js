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
const PORT = process.env.PORT || 5000;

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
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
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
// 🔍 JioSaavn Proxy
// =========================
app.get("/api/jiosaavn/search", async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.json({ success: false, data: { results: [] } });
  }

  try {
    let results = [];

    try {
      const r1 = await fetch(
        `https://jiosaavn-api.vercel.app/search/songs?query=${encodeURIComponent(
          query
        )}`,
        {
          headers: {
            "User-Agent": "Mozilla/5.0",
            Accept: "application/json",
          },
        }
      );
      const j1 = await r1.json();
      results = j1?.data?.results || [];
    } catch {}

    if (!results.length) {
      try {
        const r2 = await fetch(
          `https://saavn.dev/api/search/songs?query=${encodeURIComponent(
            query
          )}&limit=20`
        );
        const j2 = await r2.json();
        results = j2?.data?.results || [];
      } catch {}
    }

    return res.json({
      success: results.length > 0,
      data: { results },
    });
  } catch {
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

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
