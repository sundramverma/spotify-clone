import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { assets } from './../assets/frontend-assets/assets';
import { PlaylistContext } from '../context/PlaylistContext';

function Sidebar() {
    const navigate = useNavigate();
    const { playlists } = useContext(PlaylistContext);
    
    const handleCreatePlaylist = () => {
        navigate("/create-playlist");
    }

    const handleBrowsePodcasts = () => {
        console.log("Browse podcasts clicked");
        navigate("/podcasts");
    }

    return (
        <div className='w-[25%] h-full p-2 flex-col gap-2 text-white hidden lg:flex'>
            {/* Top Section */}
            <div className="bg-[#121212] h-[15%] min-h-[120px] rounded flex flex-col justify-around">
                <div onClick={() => navigate("/")} className="flex items-center gap-3 pl-8 cursor-pointer">
                    <img className='w-6' src={assets.home_icon} alt="home icon" />
                    <p className='font-bold'>Home</p>
                </div>
                <div onClick={() => navigate("/search")} className="flex items-center gap-3 pl-8 cursor-pointer">
                    <img className='w-6' src={assets.search_icon} alt="search icon" />
                    <p className='font-bold'>Search</p>
                </div>
            </div>
            
            {/* Bottom Section */}
            <div className="bg-[#121212] h-[85%] rounded overflow-y-auto">
                <div className="p-4 flex items-center justify-between sticky top-0 bg-[#121212] z-10">
                    <div className="flex items-center gap-3">
                        <img className='w-8' src={assets.stack_icon} alt="stack_icon" />
                        <p className="font-semibold">Your Library</p>
                    </div>
                    <div className='flex items-center gap-3'>
                        <img className='w-5' src={assets.arrow_icon} alt="arrow_icon" />
                        <img className='w-5' src={assets.plus_icon} alt="plus_icon" />
                    </div>
                </div>
                
                {/* Playlists Section */}
                {playlists.length > 0 && (
                    <div className="px-4 mb-4">
                        <p className="text-sm text-gray-400 mb-2">YOUR PLAYLISTS</p>
                        {playlists.map(playlist => (
                            <div
                                key={playlist.id}
                                onClick={() => navigate(`/playlist/${playlist.id}`)}
                                className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-[#242424]"
                            >
                                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded"></div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{playlist.name}</p>
                                    <p className="text-xs text-gray-400 truncate">Playlist • {playlist.songs.length} songs</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                {/* Create Playlist Card */}
                <div className="p-4 bg-[#242424] m-2 rounded font-semibold flex flex-col items-start justify-start gap-1 pl-4 h-[140px]">
                    <h1 className="text-base">Create your first playlist</h1>
                    <p className='font-light text-sm'>It is easy we will help you</p>
                    <button 
                        onClick={handleCreatePlaylist}
                        className='px-4 py-1.5 bg-white text-[13px] text-black rounded-full mt-2 cursor-pointer hover:bg-gray-200'
                    >
                        Create Playlist
                    </button>
                </div>
                
                {/* Podcast Card */}
                <div className="p-4 bg-[#242424] m-2 rounded font-semibold flex flex-col items-start justify-start gap-1 pl-4 h-[140px]">
                   <h1 className="text-base">Let&apos;s find some podcasts to follow</h1>
<p className='font-light text-sm'>We&apos;ll keep you updated on new episodes</p>
                    <button 
                        onClick={handleBrowsePodcasts}
                        className='px-4 py-1.5 bg-white text-[13px] text-black rounded-full mt-2 cursor-pointer hover:bg-gray-200'
                    >
                        Browse Podcasts
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Sidebar;