import { useContext, useEffect, useState } from "react";
import { PlayerContext } from "../context/PlayerContext";
import { assets } from "../assets/frontend-assets/assets";

function Player() {
  const {
    audioRef,
    track,
    playStatus,
    play,
    pause,
    nextSong,
    previousSong,
  } = useContext(PlayerContext);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false); // 🔥 VERY IMPORTANT

  /* 🔊 AUDIO EVENTS */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      if (!isSeeking) {
        setCurrentTime(audio.currentTime || 0);
      }
    };

    const onLoadedMeta = () => {
      if (!isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMeta);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMeta);
    };
  }, [audioRef, isSeeking]);

  const formatTime = (t) => {
    if (!t || isNaN(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  if (!track) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[90px] bg-black text-white z-50 flex items-center px-6">

      {/* LEFT */}
      <div className="w-[260px] flex items-center gap-4">
        <img
          src={track.image || assets.spotify_logo}
          className="w-12 h-12 rounded object-cover"
        />
        <div className="truncate">
          <p className="font-medium truncate">{track.name}</p>
          <p className="text-xs text-gray-400 truncate">
            {track.desc || track.host || ""}
          </p>
        </div>
      </div>

      {/* CENTER (TRUE CENTER) */}
      <div className="absolute left-1/2 -translate-x-1/2 w-[45%] flex flex-col items-center">

        {/* CONTROLS */}
        <div className="flex items-center gap-6 mb-1">
          <img
            src={assets.prev_icon}
            onClick={previousSong}
            className="w-5 cursor-pointer"
          />

          {!playStatus ? (
            <img
              src={assets.play_icon}
              onClick={play}
              className="w-8 cursor-pointer"
            />
          ) : (
            <img
              src={assets.pause_icon}
              onClick={pause}
              className="w-8 cursor-pointer"
            />
          )}

          <img
            src={assets.next_icon}
            onClick={nextSong}
            className="w-5 cursor-pointer"
          />
        </div>

        {/* SEEK BAR — FINAL FIX 🔥 */}
        <div className="flex items-center gap-3 w-full">
          <span className="text-xs text-gray-400 w-[40px] text-right">
            {formatTime(currentTime)}
          </span>

          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={currentTime}
            onMouseDown={() => setIsSeeking(true)}
            onMouseUp={(e) => {
              const audio = audioRef.current;
              if (audio) {
                audio.currentTime = Number(e.target.value);
              }
              setIsSeeking(false);
            }}
            onChange={(e) => setCurrentTime(Number(e.target.value))}
            className="flex-1"
          />

          <span className="text-xs text-gray-400 w-[40px]">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-[260px]" />
    </div>
  );
}

export default Player;
