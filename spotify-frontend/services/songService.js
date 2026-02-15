import BASE_URL from "../src/config/api.js";

// 🔹 Get all songs
export const getAllSongs = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/song`);
    return await res.json();
  } catch (error) {
    console.error("❌ Error fetching songs:", error);
    return [];
  }
};

// 🔹 Get songs by album
export const getSongsByAlbum = async (albumId) => {
  try {
    const res = await fetch(`${BASE_URL}/api/song/album/${albumId}`);
    return await res.json();
  } catch (error) {
    console.error("❌ Error fetching album songs:", error);
    return [];
  }
};
