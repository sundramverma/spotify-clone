import { useContext } from "react";
import PropTypes from "prop-types";
import { PlayerContext } from "../context/PlayerContext";

function SongsItem({ image, name, desc, id }) {
    const { playWithId, track } = useContext(PlayerContext);
    
    const handleClick = () => {
        if (id) {
            console.log('🎵 Playing song:', name);
            playWithId(id);
        } else {
            console.warn('⚠️ Cannot play - no id for:', name);
        }
    };

    return (
        <div 
            onClick={handleClick}
            className={`w-[160px] p-2 rounded cursor-pointer hover:bg-[#ffffff26] transition-all ${
                track?._id === id ? 'ring-2 ring-green-500' : ''
            }`}
        >
            <img 
                className="rounded w-[140px] h-[140px] object-cover" 
                src={image || 'https://via.placeholder.com/140'} 
                alt={name || 'Song'} 
                onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/140';
                }}
            />
            <p className="font-bold mt-2 mb-1 text-sm truncate">{name || 'Unknown Song'}</p>
            <p className="text-slate-200 text-xs truncate">{desc || ''}</p>
        </div>
    )
}

SongsItem.propTypes = {
    image: PropTypes.string,
    name: PropTypes.string,
    desc: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default SongsItem;