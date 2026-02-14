import { useContext, useEffect, useState } from "react";
import { PlayerContext } from "../context/PlayerContext";
import spotifyService from "../services/spotifyService";
import SongsItem from "./SongsItem";
import PodcastItem from "./PodcastItem";

function Search() {
  const {
    songsData,
    podcastsData,
    playFromApiQueue,
    playFromUploadedQueue,
  } = useContext(PlayerContext);

  const [query, setQuery] = useState("");
  const [apiSongs, setApiSongs] = useState([]);
  const [loading, setLoading] = useState(false);

  /* 🔍 API SEARCH (Spotify / YouTube) */
  useEffect(() => {
    if (!query.trim()) {
      setApiSongs([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        let results = await spotifyService.searchSongs(query);
        if (!results.length) {
          results = await spotifyService.searchYouTube(query);
        }
        setApiSongs(results);
      } catch (err) {
        console.error("API search error:", err);
      }
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  /* 🔍 UPLOADED FILTER */
  const uploadedSongs = songsData.filter((s) =>
    s.name?.toLowerCase().includes(query.toLowerCase())
  );

  const uploadedPodcasts = podcastsData.filter((p) =>
    p.name?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="w-full h-full overflow-y-auto bg-[#121212] text-white px-8 py-6">

      {/* SEARCH INPUT */}
      <input
        autoFocus
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="What do you want to listen to?"
        className="w-full max-w-2xl py-4 px-6 rounded-full bg-[#242424] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg mb-10"
      />

      {/* API SONGS */}
      {apiSongs.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-4">From Internet</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {apiSongs.map((song, index) => (
              <div
                key={song.id}
                onClick={() => playFromApiQueue(apiSongs, index)}
                className="bg-[#181818] p-3 rounded cursor-pointer hover:bg-[#242424]"
              >
                <img
                  src={song.image}
                  className="w-full aspect-square rounded mb-2"
                />
                <p className="font-bold text-sm truncate">{song.name}</p>
                <p className="text-xs text-gray-400 truncate">{song.desc}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* UPLOADED SONGS */}
      {uploadedSongs.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-4">Your Songs</h2>
          <div className="flex flex-wrap gap-4 mb-12">
            {uploadedSongs.map((song, index) => (
              <div
                key={song._id}
                onClick={() => playFromUploadedQueue(uploadedSongs, index)}
              >
                <SongsItem
                  image={song.image}
                  name={song.name}
                  desc={song.desc}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {/* UPLOADED PODCASTS */}
      {uploadedPodcasts.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-4">Your Podcasts</h2>
          <div className="flex flex-wrap gap-4">
            {uploadedPodcasts.map((podcast, index) => (
              <div
                key={podcast._id}
                onClick={() =>
                  playFromUploadedQueue(uploadedPodcasts, index)
                }
              >
                <PodcastItem
                  image={podcast.image}
                  name={podcast.name}
                  host={podcast.host}
                  desc={podcast.desc}
                  podcast={podcast}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {/* EMPTY STATE */}
      {!loading &&
        query &&
        apiSongs.length === 0 &&
        uploadedSongs.length === 0 &&
        uploadedPodcasts.length === 0 && (
        <p className="text-gray-400 text-xl mt-20 text-center">
  No results found for &quot;{query}&quot;
</p>


        )}
    </div>
  );
}

export default Search;
