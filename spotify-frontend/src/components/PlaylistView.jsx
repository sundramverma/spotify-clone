import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PlaylistContext } from "../context/PlaylistContext";
import { PlayerContext } from "../context/PlayerContext";
import spotifyService from "../services/spotifyService";
import { assets } from "../assets/frontend-assets/assets";

function PlaylistView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    getPlaylist,
    deletePlaylist,
    removeSongFromPlaylist,
    addSongToPlaylist,
  } = useContext(PlaylistContext);

  const {
    playFromPlaylist,
    songsData, // uploaded songs
  } = useContext(PlayerContext);

  const [playlist, setPlaylist] = useState(null);
  const [hoveredSongId, setHoveredSongId] = useState(null);
  const [showAddSongs, setShowAddSongs] = useState(false);
  const [apiSongs, setApiSongs] = useState([]);

  /* =========================
     LOAD PLAYLIST
  ========================= */
  useEffect(() => {
    const pl = getPlaylist(id);
    if (pl) setPlaylist(pl);
    else navigate("/");
  }, [id, getPlaylist, navigate]);

  /* =========================
     LOAD API SONGS (EDIT MODE)
  ========================= */
  useEffect(() => {
    if (!showAddSongs) return;

    const loadApiSongs = async () => {
      let results = await spotifyService.searchSongs("bollywood songs");
      if (!results.length) {
        results = await spotifyService.searchYouTube("bollywood songs");
      }
      setApiSongs(results);
    };

    loadApiSongs();
  }, [showAddSongs]);

  if (!playlist) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white">
        <div className="w-16 h-16 border-4 border-gray-400 border-t-green-500 rounded-full animate-spin" />
      </div>
    );
  }

  /* =========================
     HELPERS
  ========================= */
  const handlePlaySong = (index) => {
    playFromPlaylist(playlist.songs, index);
  };

  const handleDeletePlaylist = () => {
    if (window.confirm(`Delete "${playlist.name}"?`)) {
      deletePlaylist(playlist.id);
      navigate("/");
    }
  };

  const handleRemoveSong = (song, e) => {
    e.stopPropagation();
    removeSongFromPlaylist(playlist.id, song);
    setPlaylist(getPlaylist(id));
  };

  const handleAddSong = (song) => {
    addSongToPlaylist(playlist.id, song);
    setPlaylist(getPlaylist(id));
  };

  const songExists = (song) =>
    playlist.songs.some(
      s =>
        (s._id || s.id || s.youtubeId) ===
        (song._id || song.id || song.youtubeId)
    );

  return (
    <div className="px-8 py-6 text-white">

      {/* HEADER */}
      <div className="flex gap-6 items-end mb-6">
        <img
          src={playlist.songs[0]?.image || assets.spotify_logo}
          className="w-48 h-48 rounded shadow-2xl object-cover"
        />

        <div className="flex-1">
          <p className="text-sm uppercase text-gray-400">Playlist</p>
          <h1 className="text-5xl font-bold mb-2">
            {playlist.name}
          </h1>

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setShowAddSongs(!showAddSongs)}
              className="px-4 py-2 border border-green-500 text-green-500 rounded-full text-sm font-bold"
            >
              {showAddSongs ? "Close" : "Edit"}
            </button>

            <button
              onClick={handleDeletePlaylist}
              className="px-4 py-2 border border-white rounded-full text-sm font-bold"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* =========================
         ADD SONGS PANEL (SCROLL FIXED)
      ========================= */}
      {showAddSongs && (
        <div className="mb-8 bg-white/5 p-4 rounded">
          <h2 className="text-lg font-bold mb-3">
            Add Songs (Uploaded + API)
          </h2>

          {/* 🔥 SCROLL CONTAINER */}
          <div className="max-h-[420px] overflow-y-auto pr-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

              {/* UPLOADED SONGS */}
              {songsData.map(song => (
                <div
                  key={song._id}
                  className="p-2 bg-black/30 rounded"
                >
                  <img src={song.image} className="rounded mb-2" />
                  <p className="text-sm truncate">{song.name}</p>

                  {!songExists(song) && (
                    <button
                      onClick={() => handleAddSong(song)}
                      className="mt-2 text-xs text-green-400"
                    >
                      ➕ Add
                    </button>
                  )}
                </div>
              ))}

              {/* API SONGS */}
              {apiSongs.map(song => {
                const key = song.id || song.youtubeId;

                return (
                  <div
                    key={key}
                    className="p-2 bg-black/30 rounded"
                  >
                    <img src={song.image} className="rounded mb-2" />
                    <p className="text-sm truncate">{song.name}</p>

                    {!songExists(song) && (
                      <button
                        onClick={() => handleAddSong(song)}
                        className="mt-2 text-xs text-green-400"
                      >
                        ➕ Add
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =========================
         SONG LIST
      ========================= */}
      <div className="mt-8">
        <div className="grid grid-cols-[16px_1fr_1fr_80px] gap-4 px-4 py-2 text-gray-400 text-sm border-b border-gray-700">
          <div>#</div>
          <div>Title</div>
          <div>Album</div>
          <div>Duration</div>
        </div>

        {playlist.songs.map((song, index) => {
          const songKey =
            song._id || song.id || song.youtubeId;

          return (
            <div
              key={songKey}
              onClick={() => handlePlaySong(index)}
              onMouseEnter={() => setHoveredSongId(songKey)}
              onMouseLeave={() => setHoveredSongId(null)}
              className="grid grid-cols-[16px_1fr_1fr_80px] gap-4 px-4 py-2 hover:bg-white/10 rounded cursor-pointer items-center group"
            >
              <div className="text-gray-400">
                {hoveredSongId === songKey ? "▶" : index + 1}
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={song.image}
                  className="w-10 h-10 rounded object-cover"
                />
                <div>
                  <p className="font-medium">{song.name}</p>
                  <p className="text-sm text-gray-400">
                    {song.desc || song.host || ""}
                  </p>
                </div>
              </div>

              <div className="text-gray-400">
                {song.album || "-"}
              </div>

              <div className="flex items-center gap-2">
                <span>{song.duration || "--:--"}</span>
                <button
                  onClick={(e) => handleRemoveSong(song, e)}
                  className="opacity-0 group-hover:opacity-100 text-red-400"
                >
                  ✕
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PlaylistView;
