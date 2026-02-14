import { useContext, useEffect, useState } from "react";
import { PlayerContext } from "../context/PlayerContext";
import spotifyService from "../services/spotifyService";
import PropTypes from "prop-types";

/* =========================
   GREEN DOWNLOAD ICON (SVG)
========================= */
const DownloadIcon = ({ onClick }) => (
  <svg
    onClick={onClick}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    className="w-10 h-10 cursor-pointer hover:scale-110 transition"
  >
    <circle cx="32" cy="32" r="30" fill="#22c55e" />
    <path
      d="M32 14v22"
      stroke="white"
      strokeWidth="6"
      strokeLinecap="round"
    />
    <path
      d="M22 30l10 10 10-10"
      fill="none"
      stroke="white"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect x="18" y="44" width="28" height="6" rx="3" fill="white" />
  </svg>
);

DownloadIcon.propTypes = {
  onClick: PropTypes.func.isRequired,
};

function Display() {
  const {
    songsData,
    podcastsData,
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

  /* =========================
     ✅ DOWNLOAD HANDLER (FINAL)
     ✔ No duplicate condition
     ✔ Backend routes matched
  ========================= */
  const downloadSong = (song) => {
    let url = "";

    // ▶️ YOUTUBE SONG
    if (song.source === "youtube" && song.youtubeId) {
      url = `http://localhost:5000/api/download/youtube/${song.youtubeId}`;
    }

    // 🎶 API / JioSaavn SONG
    else if (song.source === "api" && song.audioUrl) {
      fetch("http://localhost:5000/api/download/api-song", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          audioUrl: song.audioUrl,
          name: song.name,
        }),
      });
      return; // ⛔ yahin stop
    }

    // 🎙️ PODCAST (CHECK FIRST)
    else if (song._id && song.type === "podcast") {
      url = `http://localhost:5000/api/download/podcast/${song._id}`;
    }

    // 🎵 UPLOADED SONG
    else if (song._id && song.file) {
      url = `http://localhost:5000/api/download/song/${song._id}`;
    }

    if (!url) {
      console.error("❌ Invalid download object", song);
      return;
    }

    // ✅ FORCE DOWNLOAD
    window.open(url, "_blank");
  };

  return (
    <div className="p-6 text-white">

      {/* =========================
         RECOMMENDED SONGS
      ========================= */}
      <h1 className="text-2xl font-bold mb-4">Recommendation Songs</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {recommendedSongs.map((song, index) => (
          <div
            key={song.id}
            onClick={() => playFromApiQueue(recommendedSongs, index)}
            className={`relative cursor-pointer group
              ${
                track?.sourceGroup === "api" && currentIndex === index
                  ? "ring-2 ring-green-500 rounded"
                  : ""
              }`}
          >
            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition">
              <DownloadIcon
                onClick={(e) => {
                  e.stopPropagation();
                  downloadSong(song);
                }}
              />
            </div>

            <img src={song.image} className="rounded" />
            <p className="mt-2">{song.name}</p>
          </div>
        ))}
      </div>

      {/* =========================
         UPLOADED SONGS
      ========================= */}
      <h1 className="text-2xl font-bold mb-4">Uploaded Songs</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {songsData.map((song, index) => (
          <div
            key={song._id}
            onClick={() => playFromUploadedQueue(songsData, index)}
            className={`relative cursor-pointer group
              ${
                track?.sourceGroup === "uploaded" &&
                currentIndex === index
                  ? "ring-2 ring-green-500 rounded"
                  : ""
              }`}
          >
            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition">
              <DownloadIcon
                onClick={(e) => {
                  e.stopPropagation();
                  downloadSong(song);
                }}
              />
            </div>

            <img src={song.image} className="rounded" />
            <p className="mt-2">{song.name}</p>
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
            className="relative cursor-pointer group"
          >
            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition">
              <DownloadIcon
                onClick={(e) => {
                  e.stopPropagation();
                  downloadSong(podcast);
                }}
              />
            </div>

            <img src={podcast.image} className="rounded" />
            <p className="mt-2">{podcast.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Display;
