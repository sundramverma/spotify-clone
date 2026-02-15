import { createContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

export const PlayerContext = createContext();

const API_BASE = "https://spotify-clone-backend-vn9v.onrender.com";

const PlayerContextProvider = ({ children }) => {
  const audioRef = useRef(null);

  const [track, setTrack] = useState(null);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [playStatus, setPlayStatus] = useState(false);

  const [songsData, setSongsData] = useState([]);
  const [podcastsData, setPodcastsData] = useState([]);

  /* =========================
     FETCH UPLOADED DATA
  ========================= */
  useEffect(() => {
    fetch(`${API_BASE}/api/song/list`)
      .then(r => r.json())
      .then(d => setSongsData(d?.songs || []))
      .catch(() => setSongsData([]));

    fetch(`${API_BASE}/api/podcast/list`)
      .then(r => r.json())
      .then(d => setPodcastsData(d?.podcasts || []))
      .catch(() => setPodcastsData([]));
  }, []);

  /* =========================
     CORE PLAY
  ========================= */
  const startPlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.load();
    audio
      .play()
      .then(() => setPlayStatus(true))
      .catch(() => {});
  };

  const play = () => startPlay();

  const pause = () => {
    audioRef.current?.pause();
    setPlayStatus(false);
  };

  /* =========================
     ▶️ PLAY API SONG
  ========================= */
  const playFromApiQueue = (list, index) => {
    if (!list?.length) return;

    const item = list[index];
    setQueue(list);
    setCurrentIndex(index);

    // ▶️ YouTube redirect
    if (item.youtubeId) {
      window.open(
        `https://www.youtube.com/watch?v=${item.youtubeId}`,
        "_blank"
      );
      return;
    }

    setTrack({
      name: item.name,
      image: item.image,
      desc: item.desc || "",
      src: item.audioUrl,
      type: "api",
    });

    setTimeout(startPlay, 50);
  };

  /* =========================
     ▶️ PLAY UPLOADED SONG / PODCAST
  ========================= */
  const playFromUploadedQueue = (list, index) => {
    if (!list?.length) return;

    const item = list[index];
    setQueue(list);
    setCurrentIndex(index);

    setTrack({
      name: item.name,
      image: item.image,
      desc: item.desc || item.host || "",
      src: item.file,
      type: "uploaded",
    });

    setTimeout(startPlay, 50);
  };

  /* =========================
     ▶️ PLAY FROM PLAYLIST (🔥 FINAL FIX)
  ========================= */
  const playFromPlaylist = (list, index) => {
    if (!list?.length) return;

    const item = list[index];
    setQueue(list);
    setCurrentIndex(index);

    // ✅ Uploaded
    if (item.file) {
      setTrack({
        name: item.name,
        image: item.image,
        desc: item.desc || item.host || "",
        src: item.file,
        type: "uploaded",
      });
      setTimeout(startPlay, 50);
      return;
    }

    // ▶️ YouTube
    if (item.youtubeId) {
      window.open(
        `https://www.youtube.com/watch?v=${item.youtubeId}`,
        "_blank"
      );
      return;
    }

    // ✅ API
    if (item.audioUrl) {
      setTrack({
        name: item.name,
        image: item.image,
        desc: item.desc || "",
        src: item.audioUrl,
        type: "api",
      });
      setTimeout(startPlay, 50);
    }
  };

  /* =========================
     NEXT / PREVIOUS
  ========================= */
  const nextSong = () => {
    if (!queue.length) return;
    const nextIndex = (currentIndex + 1) % queue.length;
    playFromPlaylist(queue, nextIndex);
  };

  const previousSong = () => {
    if (!queue.length) return;
    const prevIndex =
      (currentIndex - 1 + queue.length) % queue.length;
    playFromPlaylist(queue, prevIndex);
  };

  return (
    <PlayerContext.Provider
      value={{
        audioRef,
        track,
        playStatus,
        play,
        pause,
        nextSong,
        previousSong,
        songsData,
        podcastsData,
        playFromApiQueue,
        playFromUploadedQueue,
        playFromPlaylist, // ✅ IMPORTANT
        currentIndex,
      }}
    >
      {children}

      {/* 🔊 AUDIO ELEMENT */}
      <audio
        ref={audioRef}
        src={track?.src || ""}
        preload="auto"
        crossOrigin="anonymous"
        onEnded={nextSong}
      />
    </PlayerContext.Provider>
  );
};

PlayerContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PlayerContextProvider;
