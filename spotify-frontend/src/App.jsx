import { useContext } from "react";
import { Routes, Route } from "react-router-dom";

import Display from "./components/Display";
import Player from "./components/Player";
import Sidebar from "./components/Sidebar";
import Search from "./components/Search";
import Music from "./components/Music";
import Podcasts from "./components/Podcasts"; 
import CreatePlaylist from "./components/CreatePlaylist";
import PlaylistView from "./components/PlaylistView";
import Navbar from "./components/Navbar";
import { PlayerContext } from "./context/PlayerContext";

const App = () => {
  const { songsData } = useContext(PlayerContext);

  return (
    <div className="h-screen bg-black flex flex-col">

      {/* MAIN LAYOUT */}
      <div className="flex-1 flex min-h-0">
        <Sidebar />

        <div className="flex-1 overflow-y-auto px-6 pt-4">
          <Navbar />

          <Routes>
            <Route path="/" element={<Display />} />
            <Route path="/music" element={<Music />} />
            <Route path="/album/:id" element={<Display />} />
            <Route path="/search" element={<Search />} />
            <Route path="/podcasts" element={<Podcasts />} />
            <Route path="/create-playlist" element={<CreatePlaylist />} />
            <Route path="/playlist/:id" element={<PlaylistView />} />
          </Routes>
        </div>
      </div>

      {/* PLAYER */}
      {songsData && songsData.length !== 0 && <Player />}
    </div>
  );
};

export default App;
