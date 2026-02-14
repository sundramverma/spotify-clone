import { exec } from 'child_process';

const ytDlpPath = 'D:\\data\\yt-dlp.exe';

const spotifyService = {
  // YouTube Search
  searchYouTube: async (query, maxResults = 15) => {
    return new Promise((resolve, reject) => {
      const searchCmd = `"${ytDlpPath}" "ytsearch${maxResults}:${query}" --get-id --get-title --get-duration --get-thumbnail --get-channel`;
      
      exec(searchCmd, (error, stdout) => {
        if (error) reject(error);
        
        const lines = stdout.trim().split('\n');
        const results = [];
        
        for (let i = 0; i < lines.length; i += 5) {
          results.push({
            id: lines[i],
            title: lines[i+1],
            channel: lines[i+2] || 'Unknown',
            duration: lines[i+3] || '0:00',
            thumbnail: lines[i+4] || 'https://via.placeholder.com/150'
          });
        }
        resolve(results);
      });
    });
  },

  // Get Audio Stream URL
  getAudioStream: async (videoId) => {
    return new Promise((resolve, reject) => {
      exec(
        `"${ytDlpPath}" -g -f bestaudio "https://youtube.com/watch?v=${videoId}"`,
        (error, stdout) => {
          if (error) reject(error);
          resolve(stdout.trim());
        }
      );
    });
  }
};

export default spotifyService;