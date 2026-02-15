import { useContext, useEffect, useState } from "react";
import { PlayerContext } from "../context/PlayerContext";
import spotifyService from "../services/spotifyService";

function Display() {
  const {
    songsData,
    podcastsData,
    playFromApiQueue,
    playFromUploadedQueue,
  } = useContext(PlayerContext);

  const [recommendedSongs, setRecommendedSongs] = useState([]);

  /* =========================
     AUTO LOAD RECOMMENDATIONS
  ========================= */
  useEffect(() => {
    const load = async () => {
      let r = await spotifyService.searchSongs("bollywood songs");

      if (!Array.isArray(r) || r.length === 0) {
        r = await spotifyService.searchYouTube("bollywood songs");
      }

      setRecommendedSongs(Array.isArray(r) ? r.slice(0, 12) : []);
    };
    load();
  }, []);

  return (
    <div className="p-6 text-white">
      {/* =========================
         RECOMMENDATION SONGS
      ========================= */}
      <h1 className="text-2xl font-bold mb-4">Recommendation Songs</h1>

      {recommendedSongs.length === 0 ? (
        <p className="text-gray-400 mb-10">No recommendations right now</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {recommendedSongs.map((song, index) => (
            <div
              key={song.id}
              onClick={() => playFromApiQueue(recommendedSongs, index)}
              className="cursor-pointer"
            >
              <img src={song.image} className="rounded" />
              <p className="mt-2 text-sm">{song.name}</p>
            </div>
          ))}
        </div>
      )}

      {/* =========================
         UPLOADED SONGS
      ========================= */}
      <h1 className="text-2xl font-bold mb-4">Uploaded Songs</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {songsData.map((song, index) => (
          <div
            key={song._id}
            onClick={() => playFromUploadedQueue(songsData, index)}
            className="cursor-pointer"
          >
            <img src={song.image} className="rounded" />
            <p className="mt-2 text-sm">{song.name}</p>
          </div>
        ))}
      </div>

      {/* =========================
         PODCASTS
      ========================= */}
      <h1 className="text-2xl font-bold mb-4">Podcasts</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {podcastsData.map((podcast, index) => (
          <div
            key={podcast._id}
            onClick={() => playFromUploadedQueue(podcastsData, index)}
            className="cursor-pointer"
          >
            <img src={podcast.image} className="rounded" />
            <p className="mt-2 text-sm">{podcast.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Display;
