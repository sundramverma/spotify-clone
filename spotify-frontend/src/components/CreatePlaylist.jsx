import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlayerContext } from "../context/PlayerContext";
import { PlaylistContext } from "../context/PlaylistContext";
import spotifyService from "../services/spotifyService";

function CreatePlaylist() {
  const navigate = useNavigate();
  const { songsData } = useContext(PlayerContext);
  const {
    createPlaylist,
    addMultipleSongsToPlaylist,
    setCurrentPlaylist,
  } = useContext(PlaylistContext);

  const [step, setStep] = useState(1);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDesc, setPlaylistDesc] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [recommendedSongs, setRecommendedSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [newPlaylist, setNewPlaylist] = useState(null);

  /* 🔥 LOAD RECOMMENDED SONGS (API) */
  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        let results = await spotifyService.searchSongs("bollywood songs");
        if (results.length === 0) {
          results = await spotifyService.searchYouTube("bollywood songs");
        }
        setRecommendedSongs(results.slice(0, 8));
      } catch (err) {
        console.error("Recommendation error:", err);
      }
    };
    loadRecommendations();
  }, []);

  /* 🔍 FILTER UPLOADED SONGS */
  useEffect(() => {
    if (!songsData) return;
    if (!searchTerm.trim()) {
      setFilteredSongs(songsData);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredSongs(
        songsData.filter(
          (s) =>
            s.name?.toLowerCase().includes(term) ||
            s.album?.toLowerCase().includes(term) ||
            s.desc?.toLowerCase().includes(term)
        )
      );
    }
  }, [searchTerm, songsData]);

  /* ✅ CREATE PLAYLIST */
  const handleCreatePlaylist = () => {
    if (!playlistName.trim()) {
      alert("Enter playlist name");
      return;
    }
    const playlist = createPlaylist(playlistName, playlistDesc);
    if (playlist) {
      setNewPlaylist(playlist);
      setCurrentPlaylist(playlist);
      setStep(2);
    }
  };

  /* ➕ TOGGLE SONG SELECT */
  const toggleSong = (song) => {
    const id = song._id || song.id;
    setSelectedSongs((prev) =>
      prev.find((s) => (s._id || s.id) === id)
        ? prev.filter((s) => (s._id || s.id) !== id)
        : [...prev, song]
    );
  };

  /* ➕ ADD SONGS TO PLAYLIST */
  const handleAddSongs = () => {
    if (!newPlaylist || selectedSongs.length === 0) return;
    addMultipleSongsToPlaylist(newPlaylist.id, selectedSongs);
    navigate(`/playlist/${newPlaylist.id}`);
  };

  return (
    <div className="px-8 py-6 text-white">

      {/* STEP INDICATOR */}
      <div className="flex items-center gap-2 mb-6">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-green-500" : "bg-gray-600"}`}>1</div>
        <div className={`w-16 h-1 ${step >= 2 ? "bg-green-500" : "bg-gray-600"}`} />
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-green-500" : "bg-gray-600"}`}>2</div>
      </div>

      {step === 1 ? (
        /* STEP 1 */
        <div className="max-w-xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Create new playlist</h1>

          <div className="bg-[#242424] p-6 rounded-lg">
            <input
              className="w-full p-3 mb-4 rounded bg-[#3a3a3a]"
              placeholder="Playlist name"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
            />
            <textarea
              className="w-full p-3 mb-4 rounded bg-[#3a3a3a]"
              placeholder="Description (optional)"
              rows={3}
              value={playlistDesc}
              onChange={(e) => setPlaylistDesc(e.target.value)}
            />
            <button
              onClick={handleCreatePlaylist}
              className="px-6 py-3 bg-green-500 text-black rounded-full font-bold"
            >
              Continue
            </button>
          </div>
        </div>
      ) : (
        /* STEP 2 */
        <>
          <div className="flex justify-between mb-6">
            <h1 className="text-2xl font-bold">
              Add songs to &quot;{playlistName}&quot;
            </h1>
            <button
              onClick={handleAddSongs}
              className="px-6 py-2 bg-green-500 text-black rounded-full font-bold"
            >
              Add {selectedSongs.length} songs
            </button>
          </div>

          {/* 🔥 RECOMMENDED SONGS */}
          <h2 className="text-xl font-bold mb-3">Recommended Songs</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {recommendedSongs.map((song) => (
              <div
                key={song.id}
                onClick={() => toggleSong(song)}
                className={`p-3 rounded cursor-pointer ${
                  selectedSongs.find((s) => (s.id || s._id) === song.id)
                    ? "bg-green-500/20 border border-green-500"
                    : "bg-[#242424]"
                }`}
              >
                <img src={song.image} className="rounded mb-2" />
                <p className="font-medium truncate">{song.name}</p>
                <p className="text-sm text-gray-400 truncate">{song.desc}</p>
              </div>
            ))}
          </div>

          {/* 🔍 SEARCH */}
          <input
            className="w-full p-3 mb-4 rounded bg-[#242424]"
            placeholder="Search uploaded songs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* ✅ UPLOADED SONGS */}
          <h2 className="text-xl font-bold mb-3">Uploaded Songs</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filteredSongs.map((song) => (
              <div
                key={song._id}
                onClick={() => toggleSong(song)}
                className={`p-3 rounded cursor-pointer ${
                  selectedSongs.find((s) => (s._id || s.id) === song._id)
                    ? "bg-green-500/20 border border-green-500"
                    : "bg-[#242424]"
                }`}
              >
                <img src={song.image} className="rounded mb-2" />
                <p className="font-medium truncate">{song.name}</p>
                <p className="text-sm text-gray-400 truncate">{song.album}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default CreatePlaylist;
