import { v2 as cloudinary } from "cloudinary";
import Podcast from "../models/Podcast.js";

const addPodcast = async (req, res) => {
  try {
    const { name, desc, host, category, episodes } = req.body;
    const audioFile = req.files.audio[0];
    const imageFile = req.files.image[0];

    const audioUpload = await cloudinary.uploader.upload(audioFile.path, { resource_type: "video" });
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
    
    const minutes = Math.floor(audioUpload.duration / 60);
    const seconds = Math.floor(audioUpload.duration % 60);
    const duration = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    const podcastData = {
      name,
      desc,
      host: host || "Unknown Host",
      category: category || "podcast",
      episodes: episodes || 1,
      image: imageUpload.secure_url,
      file: audioUpload.secure_url,
      duration
    };

    const podcast = new Podcast(podcastData);
    await podcast.save();

    res.status(201).json({ success: true, message: "Podcast Added" });
  } catch (error) {
    console.log('Failed at addPodcast, ', error);
    res.status(400).json({ success: false, message: "Podcast Add Failed" });
  }
};

const listPodcast = async (req, res) => {
  try {
    const allPodcasts = await Podcast.find({});
    res.status(200).json({ success: true, podcasts: allPodcasts });
  } catch (error) {
    console.log('Failed at listPodcast, ', error);
    res.status(400).json({ success: false, message: "Podcast List Failed" });
  }
};

const removePodcast = async (req, res) => {
  try {
    const { id } = req.params;
    await Podcast.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Podcast removed successfully" });
  } catch (error) {
    console.log('Failed at removePodcast, ', error);
    res.status(400).json({ success: false, message: "Podcast removal Failed" });
  }
};

export { addPodcast, listPodcast, removePodcast };