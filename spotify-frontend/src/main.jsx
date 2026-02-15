import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import "./index.css";

import PlayerContextProvider from "./context/PlayerContext";
import PlaylistContextProvider from "./context/PlaylistContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <PlayerContextProvider>
        <PlaylistContextProvider>
          <App />
        </PlaylistContextProvider>
      </PlayerContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
