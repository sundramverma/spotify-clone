import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

function AlbumItem({ image, name, desc, id }) {
    const navigate = useNavigate();
    return (
        <div 
            onClick={() => navigate(`/album/${id}`)} 
            className="w-[160px] p-2 rounded cursor-pointer hover:bg-[#ffffff26] transition-all"
        >
            <img 
                className="rounded w-[140px] h-[140px] object-cover" 
                src={image} 
                alt={name} 
            />
            <p className="font-bold mt-2 mb-1 text-sm truncate">{name}</p>
            <p className="text-slate-200 text-xs truncate">{desc}</p>
        </div>
    )
}

AlbumItem.propTypes = {
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired
};

export default AlbumItem;