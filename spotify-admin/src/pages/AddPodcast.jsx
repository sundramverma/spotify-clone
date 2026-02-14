import { assets } from "../assets/admin-assets/assets"
import { useState } from 'react';
import axios from 'axios';
import { url } from "../App";
import { toast } from "react-toastify";

function AddPodcast() {
    const [image, setImage] = useState(null);
    const [audio, setAudio] = useState(null);
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [host, setHost] = useState("");
    const [category, setCategory] = useState("podcast");
    const [episodes, setEpisodes] = useState(1);
    const [loading, setLoading] = useState(false);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        
        if (!audio) {
            toast.error("Please select an audio file");
            return;
        }
        if (!image) {
            toast.error("Please select an image");
            return;
        }
        if (!host.trim()) {
            toast.error("Please enter host name");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('desc', desc);
            formData.append('host', host);
            formData.append('category', category);
            formData.append('episodes', episodes);
            formData.append('image', image);
            formData.append('audio', audio);

            const response = await axios.post(`${url}/api/podcast/add`, formData);

            if (response.data.success) {
                toast.success("Podcast Added Successfully!");
                setName("");
                setDesc("");
                setHost("");
                setCategory("podcast");
                setEpisodes(1);
                setImage(null);
                setAudio(null);
            } else {
                toast.error("Something went wrong.");
            }
        } catch (error) {
            console.log('error', error);
            toast.error(error.response?.data?.message || "Podcast Add Error");
        }
        setLoading(false);
    }

    return loading ? (
        <div className="grid place-items-center min-h-[80vh]">
            <div className="w-16 h-16 place-self-center border-4 border-gray-400 border-t-green-800 rounded-full animate-spin"></div>
        </div>
    ) : (
        <form onSubmit={onSubmitHandler} className="flex flex-col items-start gap-8 text-gray-600">
            {/* File Upload Section - Same as Add Song */}
            <div className="flex gap-8">
                <div className="flex flex-col gap-4">
                    <p>Upload Audio (MP3, MPEG, WAV, M4A)</p>
                    <input 
                        onChange={(e) => {
                            console.log("Selected file:", e.target.files[0]);
                            setAudio(e.target.files[0]);
                        }} 
                        type="file" 
                        id="audio" 
                        accept=".mp3,.mpeg,.mpga,.mp4,.wav,.m4a,.aac,.ogg,.flac,.webm,audio/mpeg,audio/mp3,audio/mpeg3,audio/mpga,audio/x-mpeg,audio/wav,audio/x-wav,audio/m4a,audio/aac,audio/ogg,audio/flac,audio/*" 
                        hidden 
                    />
                    <label htmlFor="audio" className="cursor-pointer">
                        <img 
                            src={audio ? assets.upload_added : assets.upload_song} 
                            className="w-24" 
                            alt="upload_audio" 
                        />
                        {audio && (
                            <div className="text-xs mt-1">
                                <p className="text-green-600 font-semibold">{audio.name}</p>
                                <p className="text-gray-500">Type: {audio.type || 'audio/mpeg'}</p>
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
                            className="w-24 h-24 object-cover" 
                            alt="upload_area" 
                        />
                        {image && (
                            <p className="text-xs mt-1 text-green-600">{image.name}</p>
                        )}
                    </label>
                </div>
            </div>

            {/* Podcast Name */}
            <div className="flex flex-col gap-2.5">
                <p>Podcast Name</p>
                <input 
                    onChange={(e) => setName(e.target.value)} 
                    value={name} 
                    type="text" 
                    className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]" 
                    placeholder="Type Here" 
                    required 
                />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2.5">
                <p>Description</p>
                <textarea
                    onChange={(e) => setDesc(e.target.value)} 
                    value={desc} 
                    rows="3"
                    className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]" 
                    placeholder="Type Here" 
                    required 
                />
            </div>

            {/* Host Name */}
            <div className="flex flex-col gap-2.5">
                <p>Host Name</p>
                <input 
                    onChange={(e) => setHost(e.target.value)} 
                    value={host} 
                    type="text" 
                    className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]" 
                    placeholder="e.g., Joe Rogan" 
                    required 
                />
            </div>

            {/* Category and Episodes - Side by side */}
            <div className="flex gap-4">
                <div className="flex flex-col gap-2.5">
                    <p>Category</p>
                    <select 
                        onChange={(e) => setCategory(e.target.value)} 
                        value={category} 
                        className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[180px]"
                    >
                        <option value="podcast">Podcast</option>
                        <option value="technology">Technology</option>
                        <option value="comedy">Comedy</option>
                        <option value="news">News</option>
                        <option value="sports">Sports</option>
                        <option value="education">Education</option>
                        <option value="business">Business</option>
                    </select>
                </div>

                <div className="flex flex-col gap-2.5">
                    <p>Episodes</p>
                    <input 
                        onChange={(e) => setEpisodes(Number(e.target.value))} 
                        value={episodes} 
                        type="number" 
                        min="1"
                        className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[100px]" 
                    />
                </div>
            </div>

            {/* Submit Button */}
            <button 
                type="submit" 
                className="text-base bg-black text-white py-2.5 px-14 cursor-pointer hover:bg-gray-800 disabled:bg-gray-400"
                disabled={!audio || !image || !name || !host}
            >
                Add Podcast
            </button>

        </form>
    )
}

export default AddPodcast;