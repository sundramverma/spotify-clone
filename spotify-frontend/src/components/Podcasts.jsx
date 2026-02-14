import { useContext, useEffect, useState } from "react";
import { PlayerContext } from "../context/PlayerContext";
import PodcastItem from "./PodcastItem";
import spotifyService from "../services/spotifyService";

function Podcasts() {
  const { podcastsData } = useContext(PlayerContext);

  const [recommendedPodcasts, setRecommendedPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* 🔥 LOAD RECOMMENDED PODCASTS */
  useEffect(() => {
    const loadRecommendedPodcasts = async () => {
      try {
        let results = await spotifyService.searchSongs("hindi podcasts");
        if (!results.length) {
          results = await spotifyService.searchYouTube("hindi podcasts");
        }
        setRecommendedPodcasts(results.slice(0, 8));
      } catch (err) {
        console.error("Podcast recommendation error:", err);
      }
      setLoading(false);
    };

    loadRecommendedPodcasts();
  }, []);

  return (
    <div className="px-8 py-6 text-white">

      {/* 🔥 RECOMMENDED PODCASTS */}
      <h1 className="text-3xl font-bold mb-6">Recommended Podcasts</h1>

      {loading ? (
        <p className="text-gray-400 mb-10">Loading podcasts…</p>
      ) : (
        <div className="flex flex-wrap gap-4 mb-14">
          {recommendedPodcasts.map((podcast) => (
            <PodcastItem
              key={podcast.id}
              image={podcast.image}
              name={podcast.name}
              host={podcast.desc}
              desc={podcast.desc}
              podcast={podcast}
            />
          ))}
        </div>
      )}

      {/* ✅ UPLOADED PODCASTS */}
      <h1 className="text-3xl font-bold mb-6">UPLOADED PODCASTS</h1>

      {podcastsData && podcastsData.length > 0 ? (
        <div className="flex flex-wrap gap-4">
          {podcastsData.map((podcast) => (
            <PodcastItem
              key={podcast._id}
              image={podcast.image}
              name={podcast.name}
              host={podcast.host}
              desc={podcast.desc}
              podcast={podcast}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 mt-20">
          <p className="text-xl">No podcasts available</p>
          <p className="text-sm mt-2">
            Add some podcasts in the admin panel first.
          </p>
        </div>
      )}
    </div>
  );
}

export default Podcasts;
