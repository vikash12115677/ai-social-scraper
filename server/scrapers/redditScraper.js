const axios = require('axios');
const Post = require('../models/Post');
const logger = require('../config/logger');

// Reddit OAuth Token
let redditToken = null;
let tokenExpiry = null;

const getRedditToken = async () => {
  if (redditToken && tokenExpiry && Date.now() < tokenExpiry) return redditToken;

  if (!process.env.REDDIT_CLIENT_ID || process.env.REDDIT_CLIENT_ID === 'your_reddit_client_id') {
    return null;
  }

  try {
    const response = await axios.post(
      'https://www.reddit.com/api/v1/access_token',
      'grant_type=client_credentials',
      {
        auth: {
          username: process.env.REDDIT_CLIENT_ID,
          password: process.env.REDDIT_CLIENT_SECRET,
        },
        headers: {
          'User-Agent': process.env.REDDIT_USER_AGENT || 'PassportScraper/1.0.0',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    redditToken = response.data.access_token;
    tokenExpiry = Date.now() + (response.data.expires_in - 60) * 1000;
    return redditToken;
  } catch (error) {
    logger.error('Reddit OAuth error:', error.message);
    return null;
  }
};

const scrapeReddit = async () => {
  const token = await getRedditToken();
  if (!token) {
    logger.warn('Reddit: No API token available. Skipping.');
    return [];
  }

  const subreddits = ['india', 'IndianPassport', 'travel', 'immigration', 'visa'];
  const keywords = ['passport', 'tatkal', 'passport renewal', 'passport application'];
  const allPosts = [];

  for (const subreddit of subreddits) {
    try {
      const response = await axios.get(
        `https://oauth.reddit.com/r/${subreddit}/search.json`,
        {
          params: { q: keywords.join(' OR '), t: 'day', limit: 25, sort: 'new' },
          headers: {
            Authorization: `Bearer ${token}`,
            'User-Agent': process.env.REDDIT_USER_AGENT || 'PassportScraper/1.0.0',
          },
        }
      );

      const posts = response.data?.data?.children || [];
      const last24h = Date.now() - 24 * 60 * 60 * 1000;

      for (const item of posts) {
        const data = item.data;
        const postedAt = new Date(data.created_utc * 1000);
        if (postedAt.getTime() < last24h) continue;

        allPosts.push({
          platform: 'reddit',
          postId: data.id,
          url: `https://reddit.com${data.permalink}`,
          username: data.author,
          displayName: data.author,
          content: `${data.title}\n${data.selftext || ''}`.trim().substring(0, 2000),
          language: 'en',
          hashtags: [],
          engagement: {
            likes: data.score || 0,
            comments: data.num_comments || 0,
            upvotes: data.ups || 0,
          },
          region: 'India',
          postedAt,
        });
      }
    } catch (error) {
      logger.error(`Reddit scrape error for r/${subreddit}:`, error.message);
    }
  }

  return allPosts;
};

module.exports = { scrapeReddit };
