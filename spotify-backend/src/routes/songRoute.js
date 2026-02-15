import express from "express";
import { addSong, listSong, removeSong } from "../controllers/songController.js";
import upload from "../middleware/multer.js";

const songRouter = express.Router();

// ADD SONG
songRouter.post(
  "/add",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  addSong
);

// LIST SONGS  ✅ (THIS IS WHAT FRONTEND USES)
songRouter.get("/list", listSong);

// REMOVE SONG
songRouter.delete("/remove/:id", removeSong);

export default songRouter;
