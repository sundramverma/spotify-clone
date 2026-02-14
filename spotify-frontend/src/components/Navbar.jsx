import { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { PlayerContext } from "../context/PlayerContext";
import spotifyService from "../services/spotifyService";
import { assets } from "../assets/frontend-assets/assets";

function Navbar() {
  const location = useLocation();
  const path = location.pathname;

  const {
    playFromApiQueue,
    track,
    currentIndex,
  } = useContext(PlayerContext);

  const [searchQuery, setSearchQuery] = useState("");
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);

  /* 🔍 SEARCH */
  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      let results = await spotifyService.searchSongs(searchQuery);
      if (!results.length) {
        results = await spotifyService.searchYouTube(searchQuery);
      }
      setSongs(results);
    } catch (err) {
      console.error("Navbar search error:", err);
    }
    setLoading(false);
  };

  return (
    <>
      {/* TOP BAR */}
      <div className="w-full flex justify-between items-center font-semibold">
        {/* LEFT ARROWS */}
        <div className="flex items-center gap-2">
          <img
            onClick={() => window.history.back()}
            className="w-8 bg-black p-2 rounded-2xl cursor-pointer hover:bg-gray-800"
            src={assets.arrow_left}
          />
          <img
            onClick={() => window.history.forward()}
            className="w-8 bg-black p-2 rounded-2xl cursor-pointer hover:bg-gray-800"
            src={assets.arrow_right}
          />
        </div>

        {/* SEARCH + TITLE */}
        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="relative w-64">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search songs..."
              className="w-full py-2 px-4 pl-10 rounded-full bg-gray-800 text-white focus:outline-none"
            />
            <img
              src={assets.search_icon}
              className="absolute left-3 top-2.5 w-5 h-5 opacity-60 cursor-pointer"
              onClick={handleSearch}
            />
          </form>

          <h1 className="text-3xl font-bold text-white whitespace-nowrap">
            SUNDRAM MUSIC
          </h1>
        </div>
      </div>

      {/* SEARCH RESULTS */}
      {searchQuery && (
        <div className="mt-4 bg-[#181818] rounded p-4">
          {loading ? (
            <p className="text-gray-400">Searching...</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {songs.map((song, index) => {
                const isActive =
                  track?.sourceGroup === "api" &&
                  currentIndex === index;

                return (
                  <div
                    key={song.id}
                    onClick={() => playFromApiQueue(songs, index)}
                    className={`bg-gray-800 p-3 rounded cursor-pointer hover:bg-gray-700
                      ${isActive ? "ring-2 ring-green-500" : ""}
                    `}
                  >
                    <img
                      src={song.image}
                      className="w-full aspect-square rounded mb-2"
                    />
                    <p className="text-sm font-bold truncate">
                      {song.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {song.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TABS */}
      <div className="flex items-center gap-2 mt-4">
        {["/", "/music", "/podcasts"].map((route, i) => (
          <p
            key={route}
            onClick={() => (window.location.href = route)}
            className={`px-6 py-2 rounded-full cursor-pointer text-sm font-medium ${
              path === route
                ? "bg-white text-black"
                : "bg-gray-800 text-white"
            }`}
          >
            {i === 0 ? "All" : i === 1 ? "Music" : "Podcasts"}
          </p>
        ))}
      </div>
    </>
  );
}

export default Navbar;
