import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { PlayerContext } from "./PlayerContext";

export const PlaylistContext = createContext();

const PlaylistContextProvider = ({ children }) => {
  const { songsData } = useContext(PlayerContext);

  const [playlists, setPlaylists] = useState([]);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);

  /* LOAD FROM LOCAL STORAGE */
  useEffect(() => {
    const saved = localStorage.getItem("spotify_playlists");
    if (saved) setPlaylists(JSON.parse(saved));
  }, []);

  /* SAVE TO LOCAL STORAGE */
  useEffect(() => {
    if (playlists.length > 0) {
      localStorage.setItem("spotify_playlists", JSON.stringify(playlists));
    } else {
      localStorage.removeItem("spotify_playlists");
    }
  }, [playlists]);

  /* CREATE PLAYLIST */
  const createPlaylist = (name, description = "") => {
    const newPlaylist = {
      id: Date.now().toString(),
      name,
      description,
      songs: [],
      createdAt: new Date().toISOString(),
      image: songsData[0]?.image || null
    };
    setPlaylists([...playlists, newPlaylist]);
    return newPlaylist;
  };

  /* ADD MULTIPLE SONGS */
  const addMultipleSongsToPlaylist = (playlistId, songsArray) => {
    setPlaylists(prev =>
      prev.map(pl =>
        pl.id === playlistId
          ? {
              ...pl,
              songs: [
                ...pl.songs,
                ...songsArray.filter(
                  s => !pl.songs.some(ps => ps._id === s._id)
                )
              ]
            }
          : pl
      )
    );
  };

  const addSongToPlaylist = (playlistId, song) => {
    addMultipleSongsToPlaylist(playlistId, [song]);
  };

  const removeSongFromPlaylist = (playlistId, songId) => {
    setPlaylists(prev =>
      prev.map(pl =>
        pl.id === playlistId
          ? { ...pl, songs: pl.songs.filter(s => s._id !== songId) }
          : pl
      )
    );
  };

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
        getPlaylist
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};

PlaylistContextProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default PlaylistContextProvider;
