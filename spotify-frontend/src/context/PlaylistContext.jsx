import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { PlayerContext } from "./PlayerContext";

export const PlaylistContext = createContext();

const PlaylistContextProvider = ({ children }) => {
  const { songsData } = useContext(PlayerContext);

  const [playlists, setPlaylists] = useState([]);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);

  /* =========================
     LOAD PLAYLISTS
  ========================= */
  useEffect(() => {
    const saved = localStorage.getItem("spotify_playlists");
    if (saved) {
      try {
        setPlaylists(JSON.parse(saved));
      } catch {
        setPlaylists([]);
      }
    }
  }, []);

  /* =========================
     SAVE PLAYLISTS
  ========================= */
  useEffect(() => {
    localStorage.setItem(
      "spotify_playlists",
      JSON.stringify(playlists)
    );
  }, [playlists]);

  /* =========================
     CREATE PLAYLIST
  ========================= */
  const createPlaylist = (name, description = "") => {
    const newPlaylist = {
      id: Date.now().toString(),
      name,
      description,
      songs: [],
      createdAt: new Date().toISOString(),
      image: songsData?.[0]?.image || null,
    };

    setPlaylists(prev => [...prev, newPlaylist]);
    return newPlaylist;
  };

  /* =========================
     UNIQUE SONG KEY
  ========================= */
  const getSongKey = (song) =>
    song?._id || song?.id || song?.youtubeId;

  /* =========================
     ADD MULTIPLE SONGS
  ========================= */
  const addMultipleSongsToPlaylist = (playlistId, songsArray) => {
    setPlaylists(prev =>
      prev.map(pl =>
        pl.id === playlistId
          ? {
              ...pl,
              songs: [
                ...pl.songs,
                ...songsArray.filter(
                  s =>
                    !pl.songs.some(
                      ps => getSongKey(ps) === getSongKey(s)
                    )
                ),
              ],
            }
          : pl
      )
    );
  };

  const addSongToPlaylist = (playlistId, song) =>
    addMultipleSongsToPlaylist(playlistId, [song]);

  /* =========================
     REMOVE SONG
  ========================= */
  const removeSongFromPlaylist = (playlistId, song) => {
    const key = getSongKey(song);
    setPlaylists(prev =>
      prev.map(pl =>
        pl.id === playlistId
          ? {
              ...pl,
              songs: pl.songs.filter(
                s => getSongKey(s) !== key
              ),
            }
          : pl
      )
    );
  };

  /* =========================
     DELETE PLAYLIST
  ========================= */
  const deletePlaylist = (playlistId) => {
    setPlaylists(prev => prev.filter(p => p.id !== playlistId));
    if (currentPlaylist?.id === playlistId) {
      setCurrentPlaylist(null);
    }
  };

  const getPlaylist = (playlistId) =>
    playlists.find(p => p.id === playlistId);

  return (
    <PlaylistContext.Provider
      value={{
        playlists,
        currentPlaylist,
        setCurrentPlaylist,
        createPlaylist,
        addSongToPlaylist,
        addMultipleSongsToPlaylist,
        removeSongFromPlaylist,
        deletePlaylist,
        getPlaylist,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};

PlaylistContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PlaylistContextProvider;
