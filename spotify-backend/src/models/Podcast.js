import mongoose from "mongoose";

const podcastSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    host: {
        type: String,
        required: true
    },
    category: {
        type: String,
        default: "podcast"
    },
    image: {
        type: String,
        required: true
    },
    file: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    episodes: {
        type: Number,
        default: 1
    }
});

const Podcast = mongoose.models.podcast || mongoose.model("podcast", podcastSchema);

export default Podcast;