const API_BASE = "https://spotify-clone-backend-vn9v.onrender.com";

/* SAFE JSON */
const safeJson = async (res) => {
  try {
    const text = await res.text();
    if (!text || text.startsWith("<")) return null;
    return JSON.parse(text);
  } catch {
    return null;
  }
};

const spotifyService = {
  /* =========================
     🔍 JioSaavn Songs
  ========================= */
  searchSongs: async (query) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/jiosaavn/search?query=${encodeURIComponent(query)}`
      );

      const data = await safeJson(res);
      if (!data?.success) return [];

      return data.data.results.map((item) => ({
        id: item.id,
        name: item.name,
        image: item.image?.[2]?.url || "",
        audioUrl: item.downloadUrl?.[4]?.url || "",
        source: "jiosaavn",
      }));
    } catch {
      return [];
    }
  },

  /* =========================
     🔍 YouTube (FINAL FIX)
  ========================= */
  searchYouTube: async (query) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/youtube/search?q=${encodeURIComponent(query)}`
      );

      const data = await safeJson(res);
      if (!data?.success) return [];

      return data.data.map((v) => ({
        id: v.id,
        name: v.title,

        // ✅ SAFE THUMBNAIL (NO 404)
        image: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,

        youtubeId: v.id,
        desc: v.artist || "YouTube",
        source: "youtube",
      }));
    } catch {
      return [];
    }
  },
};

export default spotifyService;
