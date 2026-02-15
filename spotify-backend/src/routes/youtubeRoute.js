import express from 'express';
import { spawn } from 'child_process';
import yts from 'yt-search';

const router = express.Router();

/**
 * 🔍 YouTube Search
 */
router.get('/search', async (req, res) => {
  try {
    const { q, maxResults = 15 } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, message: 'Query required' });
    }

    const result = await yts(q);

    const videos = result.videos.slice(0, Number(maxResults)).map(v => ({
      id: v.videoId,
      title: v.title,
      thumbnail: v.thumbnail,
      duration: v.seconds,
      artist: v.author?.name || 'Unknown'
    }));

    res.json({ success: true, data: videos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

/**
 * 🔊 FULL YouTube AUDIO
 */
router.get('/audio/:videoId', (req, res) => {
  const { videoId } = req.params;
  const url = `https://www.youtube.com/watch?v=${videoId}`;

  res.setHeader('Content-Type', 'audio/mpeg');
  res.setHeader('Accept-Ranges', 'bytes');

  // 🔥 Check multiple possible yt-dlp locations
  const possiblePaths = [
    'C:\\Windows\\yt-dlp.exe',
    'yt-dlp', // if in PATH
    'D:\\data\\yt-dlp.exe',
    'yt-dlp.exe'
  ];

  let pathIndex = 0;
  
  const tryNextPath = () => {
    if (pathIndex >= possiblePaths.length) {
      console.error('❌ All yt-dlp paths failed');
      return res.status(500).end();
    }

    const ytPath = possiblePaths[pathIndex++];
    console.log(`🔄 Trying yt-dlp at: ${ytPath}`);

    const yt = spawn(ytPath, [
      '-f', 'bestaudio',
      '-o', '-',
      url
    ]);

    yt.stdout.pipe(res);

    yt.stderr.on('data', (data) => {
      console.error('yt-dlp error:', data.toString());
    });

    yt.on('close', () => {
      res.end();
    });

    yt.on('error', (err) => {
      console.error(`❌ Spawn failed for ${ytPath}:`, err.message);
      tryNextPath(); // Try next path
    });
  };

  tryNextPath();
});

export default router;