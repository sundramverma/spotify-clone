import { useContext } from "react";
import PropTypes from "prop-types";
import { PlayerContext } from "../context/PlayerContext";

function PodcastItem({ podcast, image, name, host, desc }) {
  const {
    podcastsData,
    playFromUploadedQueue,
  } = useContext(PlayerContext);

  const handlePlayPodcast = () => {
    if (!podcastsData || podcastsData.length === 0) return;

    const index = podcastsData.findIndex(
      (p) => p._id === podcast._id
    );

    if (index === -1) return;

    playFromUploadedQueue(podcastsData, index);
  };

  return (
    <div
      onClick={handlePlayPodcast}
      className="w-[160px] p-2 rounded cursor-pointer hover:bg-[#ffffff26] transition-all"
    >
      <img
        src={image}
        alt={name}
        className="w-[140px] h-[140px] object-cover rounded"
      />

      <p className="font-bold mt-2 text-sm truncate">{name}</p>
      <p className="text-xs text-slate-200 truncate">{host}</p>
      <p className="text-xs text-gray-400 truncate">{desc}</p>
    </div>
  );
}

PodcastItem.propTypes = {
  podcast: PropTypes.object.isRequired,
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  host: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
};

export default PodcastItem;
