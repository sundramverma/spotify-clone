import { useEffect, useState } from "react";
import { url } from "../App";
import axios from "axios";
import { toast } from "react-toastify";

function ListPodcast() {
    const [data, setData] = useState([]);

    const fetchPodcasts = async () => {
        try {
            const response = await axios.get(`${url}/api/podcast/list`);
            if (response.data.success) {
                setData(response.data.podcasts);
            }
        } catch (error) {
            console.log('error', error);
            toast.error("Failed to load podcasts");
        }
    }

    const removePodcast = async (id) => {
        if (!window.confirm("Are you sure you want to delete this podcast?")) return;
        
        try {
            const response = await axios.delete(`${url}/api/podcast/remove/${id}`);
            if (response.data.success) {
                toast.success("Podcast removed successfully");
                await fetchPodcasts();
            }
        } catch (error) {
            console.log('error', error);
            toast.error("Failed to remove podcast");
        }
    }

    useEffect(() => {
        fetchPodcasts();
    }, [])

    return (
        <div>
            <p className="text-2xl font-bold mb-4">All Podcasts List</p>
            <hr className="mb-4" />
            
            {data.length === 0 ? (
                <p className="text-gray-500 text-center mt-10">No podcasts found. Add some podcasts first.</p>
            ) : (
                <div>
                    {/* Header */}
                    <div className="sm:grid hidden grid-cols-[0.5fr_1fr_2fr_1fr_1fr_1fr_0.5fr] items-center justify-items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 bg-gray-100">
                        <b>Image</b>
                        <b>Name</b>
                        <b>Description</b>
                        <b>Host</b>
                        <b>Category</b>
                        <b>Duration</b>
                        <b>Action</b>
                    </div>
                    
                    {/* Podcast List */}
                    {data.map((item, index) => (
                        <div key={index} className="grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[0.5fr_1fr_2fr_1fr_1fr_1fr_0.5fr] items-center justify-items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5">
                            <img className='w-12 h-12 object-cover rounded' src={item.image} alt="" />
                            <p className="font-medium">{item.name}</p>
                            <p className="truncate max-w-[200px]">{item.desc}</p>
                            <p>{item.host}</p>
                            <p className="capitalize">{item.category}</p>
                            <p>{item.duration}</p>
                            <p 
                                className='font-bold text-red-500 cursor-pointer hover:text-red-700 text-lg' 
                                onClick={() => removePodcast(item._id)}
                            >
                                ×
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ListPodcast;