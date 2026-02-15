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
  const [isSeeking, setIsSeeking] = useState(false);

  useEffect(() => {
    const audio = audioRef?.current;
    if (!audio) return;

    const onTime = () =>
      !isSeeking && setCurrentTime(audio.currentTime || 0);
    const onMeta = () =>
      !isNaN(audio.duration) && setDuration(audio.duration);

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
    };
  }, [audioRef, isSeeking, track]);

  const format = (t) => {
    if (!t || isNaN(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  if (!track) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[90px] bg-black text-white flex items-center px-6 z-50">
      {/* LEFT */}
      <div className="w-[260px] flex items-center gap-4">
        <img src={track.image} className="w-12 h-12 rounded" />
        <p className="truncate">{track.name}</p>
      </div>

      {/* CENTER */}
      <div className="absolute left-1/2 -translate-x-1/2 w-[45%] flex flex-col items-center">
        <div className="flex gap-6 mb-1">
          <img src={assets.prev_icon} onClick={previousSong} className="w-5 cursor-pointer" />
          {!playStatus ? (
            <img src={assets.play_icon} onClick={play} className="w-8 cursor-pointer" />
          ) : (
            <img src={assets.pause_icon} onClick={pause} className="w-8 cursor-pointer" />
          )}
          <img src={assets.next_icon} onClick={nextSong} className="w-5 cursor-pointer" />
        </div>

        <div className="flex items-center gap-3 w-full">
          <span className="text-xs w-[40px]">{format(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={currentTime}
            onMouseDown={() => setIsSeeking(true)}
            onMouseUp={(e) => {
              audioRef.current.currentTime = Number(e.target.value);
              setIsSeeking(false);
            }}
            onChange={(e) => setCurrentTime(Number(e.target.value))}
            className="flex-1"
          />
          <span className="text-xs w-[40px]">{format(duration)}</span>
        </div>
      </div>

      <div className="w-[260px]" />
    </div>
  );
}

export default Player;
