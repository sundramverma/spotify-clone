import { assets } from "../assets/admin-assets/assets"
import { useEffect, useState } from 'react';
import axios from 'axios';
import { url } from "../App";
import { toast } from "react-toastify";

function AddSong() {
    const [image, setImage] = useState(null);
    const [song, setSong] = useState(null);
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [album, setAlbum] = useState("none");
    const [loading, setLoading] = useState(false);
    const [albumData, setAlbumData] = useState([]);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        
        if (!song) {
            toast.error("Please select an audio file");
            return;
        }
        if (!image) {
            toast.error("Please select an image");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('desc', desc);
            formData.append('image', image);
            formData.append('audio', song);
            formData.append('album', album);

            const response = await axios.post(`${url}/api/song/add`, formData);

            if (response.data.success) {
                toast.success("Song Added");
                setName("");
                setDesc("");
                setAlbum("none");
                setImage(null);
                setSong(null);
            } else {
                toast.error("Something went wrong.");
            }
        } catch (error) {
            console.log('error', error);
            toast.error("Song Add Error");
        }
        setLoading(false);
    }

    const loadAlbumData = async () => {
        try {
            const response = await axios.get(`${url}/api/album/list`);
            if (response.data.success) {
                setAlbumData(response.data.albums);
            }
        } catch (error) {
            console.log('error', error);
            toast.error("Cannot connect to server");
        }
    }

    useEffect(() => {
        loadAlbumData();
    }, [])

    return loading ? (
        <div className="grid place-items-center min-h-[80vh]">
            <div className="w-16 h-16 place-self-center border-4 border-gray-400 border-t-green-800 rounded-full animate-spin"></div>
        </div>
    ) : (
        <form onSubmit={onSubmitHandler} className="flex flex-col items-start gap-8 text-gray-600">
            <div className="flex gap-8">
                <div className="flex flex-col gap-4">
                    <p>Upload Song (MP3, MPEG, WAV, M4A)</p>
                    <input 
                        onChange={(e) => {
                            console.log("Selected file:", e.target.files[0]);
                            setSong(e.target.files[0]);
                        }} 
                        type="file" 
                        id="song" 
                        // ✅ ALL AUDIO FORMATS INCLUDED
                        accept=".mp3,.mpeg,.mpga,.mp4,.wav,.m4a,.aac,.ogg,.flac,.webm,audio/mpeg,audio/mp3,audio/mpeg3,audio/mpga,audio/x-mpeg,audio/wav,audio/x-wav,audio/m4a,audio/aac,audio/ogg,audio/flac,audio/*" 
                        hidden 
                    />
                    <label htmlFor="song" className="cursor-pointer">
                        <img 
                            src={song ? assets.upload_added : assets.upload_song} 
                            className="w-24" 
                            alt="upload_song" 
                        />
                        {song && (
                            <div className="text-xs mt-1">
                                <p className="text-green-600 font-semibold">{song.name}</p>
                                <p className="text-gray-500">Type: {song.type || 'audio/mpeg'}</p>
                            </div>
                        )}
                    </label>
                </div>
                <div className="flex flex-col gap-4">
                    <p>Upload Image</p>
                    <input 
                        onChange={(e) => setImage(e.target.files[0])} 
                        type="file" 
                        id="image" 
                        accept="image/*" 
                        hidden 
                    />
                    <label htmlFor="image" className="cursor-pointer">
                        <img 
                            src={image ? URL.createObjectURL(image) : assets.upload_area} 
                            className="w-24" 
                            alt="upload_area" 
                        />
                        {image && (
                            <p className="text-xs mt-1 text-green-600">{image.name}</p>
                        )}
                    </label>
                </div>
            </div>

            <div className="flex flex-col gap-2.5">
                <p>Song Name</p>
                <input 
                    onChange={(e) => setName(e.target.value)} 
                    value={name} 
                    type="text" 
                    className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]" 
                    placeholder="Type Here" 
                    required 
                />
            </div>

            <div className="flex flex-col gap-2.5">
                <p>Song Description</p>
                <input 
                    onChange={(e) => setDesc(e.target.value)} 
                    value={desc} 
                    type="text" 
                    className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]" 
                    placeholder="Type Here" 
                    required 
                />
            </div>

            <div className="flex flex-col gap-2.5">
                <p>Album</p>
                <select 
                    onChange={(e) => setAlbum(e.target.value)} 
                    value={album} 
                    className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[250px]"
                >
                    <option value="none">None (Single)</option>
                    {albumData.map((item) => (
                        <option key={item._id} value={item.name}>{item.name}</option>
                    ))}
                </select>

                {albumData.length === 0 && (
    <p className="text-sm text-orange-500 mt-1">
        No albums available. Go to &quot;Add Album&quot; page first.
    </p>
)}


            </div>

            <button 
                type="submit" 
                className="text-base bg-black text-white py-2.5 px-14 cursor-pointer hover:bg-gray-800 disabled:bg-gray-400"
                disabled={!song || !image}
            >
                Add Song
            </button>

        </form>
    )
}

export default AddSong