const axios = require('axios');
const logger = require('../config/logger');

const scrapeYouTube = async () => {
  if (!process.env.YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY === 'your_youtube_api_key') {
    logger.warn('YouTube: No API key. Skipping.');
    return [];
  }

  const keywords = ['passport application India', 'tatkal passport', 'passport renewal 2024', 'Indian passport'];
  const allPosts = [];
  const publishedAfter = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  for (const keyword of keywords.slice(0, 2)) {
    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          q: keyword,
          type: 'video',
          publishedAfter,
          maxResults: 10,
          order: 'date',
          key: process.env.YOUTUBE_API_KEY,
        },
      });

      for (const item of response.data.items || []) {
        const snippet = item.snippet;
        allPosts.push({
          platform: 'youtube',
          postId: item.id.videoId,
          url: `https://youtube.com/watch?v=${item.id.videoId}`,
          username: snippet.channelTitle,
          displayName: snippet.channelTitle,
          content: `${snippet.title}\n${snippet.description || ''}`.substring(0, 1000),
          profileImage: snippet.thumbnails?.default?.url || '',
          language: 'en',
          hashtags: [],
          engagement: { views: 0, comments: 0, likes: 0 },
          postedAt: new Date(snippet.publishedAt),
        });
      }
    } catch (error) {
      logger.error('YouTube scrape error:', error.message);
    }
  }

  return allPosts;
};

module.exports = { scrapeYouTube };
