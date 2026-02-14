import { createContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

export const PlayerContext = createContext();

const PlayerContextProvider = ({ children }) => {
  const url = "http://localhost:5000";
  const audioRef = useRef(null);
  const lastSrcRef = useRef(null); // 🔥 SEEK BUG FIX

  const [songsData, setSongsData] = useState([]);
  const [podcastsData, setPodcastsData] = useState([]);

  const [track, setTrack] = useState(null);
  const [playStatus, setPlayStatus] = useState(false);

  // 🔥 SEPARATE QUEUES
  const [apiQueue, setApiQueue] = useState([]);
  const [uploadedQueue, setUploadedQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  /* ▶ PLAY / PAUSE */
  const play = () => audioRef.current?.play();
  const pause = () => audioRef.current?.pause();

  /* ▶ PLAY API QUEUE */
  const playFromApiQueue = (list, index) => {
    if (!list?.length) return;
    setApiQueue(list);
    setUploadedQueue([]);
    setCurrentIndex(index);
    setTrack({ ...list[index], sourceGroup: "api" });
  };

  /* ▶ PLAY UPLOADED QUEUE */
  const playFromUploadedQueue = (list, index) => {
    if (!list?.length) return;
    setUploadedQueue(list);
    setApiQueue([]);
    setCurrentIndex(index);
    setTrack({ ...list[index], sourceGroup: "uploaded" });
  };

  /* ⏭ NEXT */
  const nextSong = () => {
    const queue =
      track?.sourceGroup === "api" ? apiQueue : uploadedQueue;

    if (!queue || currentIndex >= queue.length - 1) return;

    const i = currentIndex + 1;
    setCurrentIndex(i);
    setTrack({ ...queue[i], sourceGroup: track.sourceGroup });
  };

  /* ⏮ PREVIOUS */
  const previousSong = () => {
    const queue =
      track?.sourceGroup === "api" ? apiQueue : uploadedQueue;

    if (!queue || currentIndex <= 0) return;

    const i = currentIndex - 1;
    setCurrentIndex(i);
    setTrack({ ...queue[i], sourceGroup: track.sourceGroup });
  };

  /* 🔊 LOAD AUDIO (🔥 SEEK RESET FIX HERE) */
  useEffect(() => {
    if (!track || !audioRef.current) return;

    let src = "";

    if (track.source === "youtube") {
      src = `${url}/api/youtube/audio/${track.id}`;
    } else {
      const path =
        track.audioUrl || track.file || track.audio || track.filePath;
      if (path) {
        src = path.startsWith("http") ? path : `${url}${path}`;
      }
    }

    if (!src) return;

    // 🚨 SAME SONG → DO NOT RELOAD (SEEK SAFE)
    if (lastSrcRef.current === src) return;

    lastSrcRef.current = src;

    const audio = audioRef.current;
    audio.pause();
    audio.src = src;
    audio.load();
    audio.play().catch(() => {});
  }, [track]);

  /* 🔄 PLAY / PAUSE ICON SYNC */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.onplay = () => setPlayStatus(true);
    audio.onpause = () => setPlayStatus(false);

    return () => {
      audio.onplay = null;
      audio.onpause = null;
    };
  }, []);

  /* ▶ AUTO NEXT ON END */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.onended = nextSong;
    return () => (audio.onended = null);
  }, [currentIndex, apiQueue, uploadedQueue, track]);

  /* 📡 LOAD DATA */
  useEffect(() => {
    axios
      .get(`${url}/api/song/list`)
      .then((r) => r.data?.songs && setSongsData(r.data.songs));

    axios
      .get(`${url}/api/podcast/list`)
      .then((r) => r.data?.podcasts && setPodcastsData(r.data.podcasts));
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        audioRef,
        track,
        songsData,
        podcastsData,
        playStatus,
        play,
        pause,
        nextSong,
        previousSong,
        playFromApiQueue,
        playFromUploadedQueue,
        currentIndex, // ✅ green highlight + navigation
      }}
    >
      {children}
      <audio ref={audioRef} preload="auto" />
    </PlayerContext.Provider>
  );
};

PlayerContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PlayerContextProvider;
