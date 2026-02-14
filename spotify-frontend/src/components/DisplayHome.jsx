import { useContext } from "react";
import { useLocation } from "react-router-dom";
import AlbumItem from "./AlbumItem";
import Navbar from "./Navbar";
import SongsItem from "./SongsItem";
import PodcastItem from "./PodcastItem"; // ✅ Import PodcastItem
import { PlayerContext } from "../context/PlayerContext";

function DisplayHome() {
  const { songsData, albumsData, podcastsData } = useContext(PlayerContext); // ✅ Add podcastsData
  const location = useLocation();

  const path = location.pathname;

  return (
    <>
      <Navbar />

      {/* ================= ALL (HOME) ================= */}
      {path === "/" && (
        <>
          {/* Featured Charts - Albums */}
          <div className="mb-6">
            <h1 className="my-4 font-bold text-xl">Featured Charts</h1>
            {albumsData && albumsData.length > 0 ? (
              <div className="flex overflow-auto gap-3 pb-2">
                {albumsData.map((item) => (
                  <div key={item._id} className="flex-shrink-0 w-[160px]">
                    <AlbumItem
                      image={item.image}
                      name={item.name}
                      desc={item.desc}
                      id={item._id}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No albums yet.</p>
            )}
          </div>

          {/* Popular Songs */}
          <div className="mb-6">
            <h1 className="my-4 font-bold text-xl">Popular songs</h1>
            {songsData && songsData.length > 0 ? (
              <div className="flex overflow-auto gap-3 pb-2">
                {songsData.map((item) => (
                  <div key={item._id} className="flex-shrink-0 w-[160px]">
                    <SongsItem
                      image={item.image}
                      name={item.name}
                      desc={item.desc}
                      id={item._id}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No songs yet.</p>
            )}
          </div>

          {/* Podcasts Section - NEW */}
          {podcastsData && podcastsData.length > 0 && (
            <div className="mb-6">
              <h1 className="my-4 font-bold text-xl">Popular Podcasts</h1>
              <div className="flex overflow-auto gap-3 pb-2">
                {podcastsData.map((item) => (
                  <div key={item._id} className="flex-shrink-0 w-[160px]">
                    <PodcastItem
                      image={item.image}
                      name={item.name}
                      host={item.host}
                      desc={item.desc}
                      id={item._id}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* ================= MUSIC ================= */}
      {path === "/music" && (
        <>
          <h1 className="my-4 font-bold text-xl">All Songs</h1>
          {songsData && songsData.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {songsData.map((item) => (
                <SongsItem
                  key={item._id}
                  image={item.image}
                  name={item.name}
                  desc={item.desc}
                  id={item._id}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No songs available.</p>
          )}
        </>
      )}

      {/* ================= PODCASTS ================= */}
      {path === "/podcasts" && (
        <div className="mt-4">
          <h1 className="text-xl font-bold mb-4">All Podcasts</h1>
          {podcastsData && podcastsData.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {podcastsData.map((item) => (
                <PodcastItem
                  key={item._id}
                  image={item.image}
                  name={item.name}
                  host={item.host}
                  desc={item.desc}
                  id={item._id}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No podcasts available right now 🎙️</p>
          )}
        </div>
      )}
    </>
  );
}

export default DisplayHome;