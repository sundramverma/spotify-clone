import { useContext, useEffect, useState } from "react";
import { PlayerContext } from "../context/PlayerContext";
import spotifyService from "../services/spotifyService";

function Music() {
  const {
    songsData,
    playFromApiQueue,
    playFromUploadedQueue,
    track,
    currentIndex,
  } = useContext(PlayerContext);

  const [recommendedSongs, setRecommendedSongs] = useState([]);

  useEffect(() => {
    const load = async () => {
      let r = await spotifyService.searchSongs("bollywood songs");
      if (!r.length) r = await spotifyService.searchYouTube("bollywood songs");
      setRecommendedSongs(r.slice(0, 12));
    };
    load();
  }, []);

  return (
    <div className="px-8 py-6 text-white">

      {/* API SONGS */}
      <h1 className="text-2xl font-bold mb-4">Recommendation Songs</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {recommendedSongs.map((song, index) => (
          <div
            key={song.id}
            onClick={() => playFromApiQueue(recommendedSongs, index)}
            className={`bg-gray-800 p-3 rounded cursor-pointer hover:bg-gray-700
              ${
                track?.sourceGroup === "api" && currentIndex === index
                  ? "ring-2 ring-green-500"
                  : ""
              }`}
          >
            <img src={song.image} className="rounded mb-2" />
            <p className="font-bold text-sm truncate">{song.name}</p>
            <p className="text-xs text-gray-400 truncate">{song.desc}</p>
          </div>
        ))}
      </div>

      {/* UPLOADED SONGS */}
      <h1 className="text-2xl font-bold mb-4">Uploaded Songs</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {songsData.map((song, index) => (
          <div
            key={song._id}
            onClick={() => playFromUploadedQueue(songsData, index)}
            className={`bg-gray-800 p-3 rounded cursor-pointer hover:bg-gray-700
              ${
                track?.sourceGroup === "uploaded" &&
                currentIndex === index
                  ? "ring-2 ring-green-500"
                  : ""
              }`}
          >
            <img src={song.image} className="rounded mb-2" />
            <p className="font-bold text-sm truncate">{song.name}</p>
            <p className="text-xs text-gray-400 truncate">{song.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Music;
