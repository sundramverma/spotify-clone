import { useContext, useEffect, useState } from "react";
import { PlayerContext } from "../context/PlayerContext";
import PodcastItem from "./PodcastItem";
import spotifyService from "../services/spotifyService";

function Podcasts() {
  const { podcastsData } = useContext(PlayerContext);

  const [recommendedPodcasts, setRecommendedPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* 🔥 LOAD RECOMMENDED PODCASTS (API / YOUTUBE) */
  useEffect(() => {
    const load = async () => {
      let results = await spotifyService.searchSongs("hindi podcasts");
      if (!results.length) {
        results = await spotifyService.searchYouTube("hindi podcasts");
      }
      setRecommendedPodcasts(results.slice(0, 8));
      setLoading(false);
    };

    load();
  }, []);

  return (
    <div className="px-8 py-6 text-white">

      {/* 🔥 RECOMMENDED PODCASTS */}
      <h1 className="text-3xl font-bold mb-6">
        Recommended Podcasts
      </h1>

      {loading ? (
        <p className="text-gray-400 mb-10">Loading podcasts…</p>
      ) : (
        <div className="flex flex-wrap gap-4 mb-14">
          {recommendedPodcasts.map((p) => (
            <PodcastItem
              key={p.id}
              podcast={p}
              image={p.image}
              name={p.name}
              host={p.desc || "Podcast"}
              desc={p.desc || ""}
            />
          ))}
        </div>
      )}

      {/* ✅ UPLOADED PODCASTS */}
      <h1 className="text-3xl font-bold mb-6">
        Uploaded Podcasts
      </h1>

      {podcastsData?.length > 0 ? (
        <div className="flex flex-wrap gap-4">
          {podcastsData.map((podcast) => (
            <PodcastItem
              key={podcast._id}
              podcast={podcast}
              image={podcast.image}
              name={podcast.name}
              host={podcast.host}
              desc={podcast.desc}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 mt-20">
          <p className="text-xl">No podcasts available</p>
          <p className="text-sm mt-2">
            Add some podcasts from admin panel.
          </p>
        </div>
      )}
    </div>
  );
}

export default Podcasts;
