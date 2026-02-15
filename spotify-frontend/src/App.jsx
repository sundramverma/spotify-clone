import { useContext } from "react";
import { Routes, Route } from "react-router-dom";

import Display from "./components/Display";
import DisplayAlbum from "./components/DisplayAlbum";
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
    <div className="h-screen bg-black overflow-hidden">
      {/* MAIN LAYOUT */}
      <div className="flex h-full">

        {/* SIDEBAR */}
        <Sidebar />

        {/* MAIN CONTENT */}
        <div className="flex-1 flex flex-col min-h-0">

          {/* NAVBAR (fixed) */}
          <Navbar />

          {/* SCROLLABLE CONTENT */}
          <div className="flex-1 overflow-y-auto px-6 pb-32">
            <Routes>
              <Route path="/" element={<Display />} />
              <Route path="/music" element={<Music />} />
              <Route path="/album/:id" element={<DisplayAlbum />} />
              <Route path="/search" element={<Search />} />
              <Route path="/podcasts" element={<Podcasts />} />
              <Route path="/create-playlist" element={<CreatePlaylist />} />
              <Route path="/playlist/:id" element={<PlaylistView />} />
            </Routes>
          </div>

        </div>
      </div>

      {/* PLAYER (fixed bottom) */}
      {songsData && songsData.length !== 0 && <Player />}
    </div>
  );
};

export default App;
