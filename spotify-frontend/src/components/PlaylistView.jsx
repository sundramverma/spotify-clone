import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PlaylistContext } from "../context/PlaylistContext";
import { PlayerContext } from "../context/PlayerContext";
import { assets } from "../assets/frontend-assets/assets";

function PlaylistView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    getPlaylist,
    deletePlaylist,
    removeSongFromPlaylist,
  } = useContext(PlaylistContext);

  const { playFromUploadedQueue } = useContext(PlayerContext);

  const [playlist, setPlaylist] = useState(null);
  const [hoveredSongId, setHoveredSongId] = useState(null);

  /* 🔄 LOAD PLAYLIST */
  useEffect(() => {
    const pl = getPlaylist(id);
    if (pl) setPlaylist(pl);
    else navigate("/");
  }, [id, getPlaylist, navigate]);

  if (!playlist) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white">
        <div className="w-16 h-16 border-4 border-gray-400 border-t-green-500 rounded-full animate-spin" />
      </div>
    );
  }

  /* ▶ PLAY FROM PLAYLIST (QUEUE BASED) */
  const handlePlaySong = (index) => {
    if (!playlist.songs || playlist.songs.length === 0) return;
    playFromUploadedQueue(playlist.songs, index);
  };

  const handleDeletePlaylist = () => {
    if (window.confirm(`Delete "${playlist.name}"?`)) {
      deletePlaylist(playlist.id);
      navigate("/");
    }
  };

  const handleRemoveSong = (songId, e) => {
    e.stopPropagation();
    removeSongFromPlaylist(playlist.id, songId);
    setPlaylist(getPlaylist(id));
  };

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
          <h1 className="text-5xl font-bold mb-2">{playlist.name}</h1>

          <div className="flex gap-4 text-sm text-gray-400">
            <span>{playlist.songs.length} songs</span>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={handleDeletePlaylist}
              className="px-4 py-2 border border-white rounded-full text-sm font-bold"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* SONG LIST */}
      <div className="mt-8">
        <div className="grid grid-cols-[16px_1fr_1fr_80px] gap-4 px-4 py-2 text-gray-400 text-sm border-b border-gray-700">
          <div>#</div>
          <div>Title</div>
          <div>Album</div>
          <div>Duration</div>
        </div>

        {playlist.songs.map((song, index) => {
          const songId = song._id || song.id;

          return (
            <div
              key={songId}
              onClick={() => handlePlaySong(index)}
              onMouseEnter={() => setHoveredSongId(songId)}
              onMouseLeave={() => setHoveredSongId(null)}
              className="grid grid-cols-[16px_1fr_1fr_80px] gap-4 px-4 py-2 hover:bg-white/10 rounded cursor-pointer items-center group"
            >
              <div className="text-gray-400">
                {hoveredSongId === songId ? (
                  <img src={assets.play_icon} className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={song.image || assets.spotify_logo}
                  className="w-10 h-10 rounded object-cover"
                />
                <div>
                  <p className="font-medium">{song.name}</p>
                  <p className="text-sm text-gray-400">{song.desc}</p>
                </div>
              </div>

              <div className="text-gray-400">{song.album || "-"}</div>

              <div className="flex items-center gap-2">
                <span className="text-gray-400">{song.duration || "--:--"}</span>

                {song._id && (
                  <button
                    onClick={(e) => handleRemoveSong(song._id, e)}
                    className="opacity-0 group-hover:opacity-100 text-red-400"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PlaylistView;
