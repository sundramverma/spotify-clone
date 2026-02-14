// spotify-frontend/src/components/SpotifyTest.jsx
import { useState } from 'react';
import spotifyService from '../services/spotifyService';

function SpotifyTest() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('bollywood');
  const [apiStatus, setApiStatus] = useState(null);

  const testAPIConnection = async () => {
    setLoading(true);
    const working = await spotifyService.testAPI();
    setApiStatus(working);
    setLoading(false);
  };

  const searchMusic = async () => {
    setLoading(true);
    const songs = await spotifyService.searchSongs(query, 10);
    setResults(songs);
    setLoading(false);
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Spotify API Test</h1>
      
      <div className="mb-6">
        <button
          onClick={testAPIConnection}
          className="px-4 py-2 bg-blue-500 rounded mr-4"
        >
          Test API Connection
        </button>
        {apiStatus !== null && (
          <span className={apiStatus ? 'text-green-500' : 'text-red-500'}>
            {apiStatus ? '✅ Connected' : '❌ Failed'}
          </span>
        )}
      </div>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 p-2 bg-gray-800 rounded"
          placeholder="Search songs..."
        />
        <button
          onClick={searchMusic}
          className="px-6 py-2 bg-green-500 text-black rounded"
        >
          Search
        </button>
      </div>

      {loading && <p className="text-center">Loading...</p>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {results.map(song => (
          <div key={song.id} className="bg-gray-800 p-2 rounded">
            <img src={song.image} alt={song.name} className="w-full h-32 object-cover rounded" />
            <p className="font-bold mt-2 truncate">{song.name}</p>
            <p className="text-sm text-gray-400 truncate">{song.desc}</p>
            <p className="text-xs text-gray-500">{song.duration}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SpotifyTest;