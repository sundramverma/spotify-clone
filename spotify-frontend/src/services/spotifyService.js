const API_BASE = 'http://localhost:5000/api';

const spotifyService = {
  // 🔥 JioSaavn FULL SONG
  searchSongs: async (query) => {
    const res = await fetch(
      `${API_BASE}/jiosaavn/search?query=${encodeURIComponent(query)}`
    );
    const data = await res.json();

    if (!data.success || !data.data?.results) return [];

    return data.data.results.map(item => ({
      id: item.id,
      name: item.name,
      image: item.image?.[2]?.url,
      desc: item.artists?.primary?.[0]?.name,
      duration: item.duration,
      language: item.language,
      audioUrl: item.downloadUrl?.[4]?.url,
      source: 'jiosaavn'
    }));
  },

  // 🔥 YouTube FULL AUDIO (backend)
  searchYouTube: async (query) => {
    const res = await fetch(
      `${API_BASE}/youtube/search?q=${encodeURIComponent(query)}`
    );
    const data = await res.json();

    return data.success
      ? data.data.map(v => ({
          id: v.id,
          name: v.title,
          image: v.thumbnail,
          desc: v.artist,
          duration: v.duration,
          source: 'youtube'
        }))
      : [];
  }
};

export default spotifyService;
