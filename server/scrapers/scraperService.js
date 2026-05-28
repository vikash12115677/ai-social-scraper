const Post = require('../models/Post');
const aiService = require('../ai/aiService');
const { scrapeReddit } = require('./redditScraper');
const { scrapeYouTube } = require('./youtubeScraper');
const { generateMockPosts } = require('./mockDataGenerator');
const logger = require('../config/logger');

// Save posts to MongoDB with duplicate prevention
const savePosts = async (rawPosts) => {
  let saved = 0, duplicates = 0, errors = 0;

  for (const postData of rawPosts) {
    try {
      // Check duplicate
      const exists = await Post.findOne({ platform: postData.platform, postId: postData.postId });
      if (exists) { duplicates++; continue; }

      // Process with AI
      const aiData = await aiService.processPost(postData);
      const post = await Post.create({ ...postData, ...aiData });
      saved++;

    } catch (error) {
      if (error.code === 11000) { duplicates++; }
      else {
        errors++;
        logger.error('Save post error:', error.message);
      }
    }
  }

  return { saved, duplicates, errors };
};

// Main scraper function
const runScraper = async () => {
  logger.info('🔍 Starting passport social media scraper...');
  const startTime = Date.now();

  try {
    // Collect posts from all sources
    const [redditPosts, youtubePosts] = await Promise.allSettled([
      scrapeReddit(),
      scrapeYouTube(),
    ]);

    let allPosts = [];

    if (redditPosts.status === 'fulfilled') allPosts = [...allPosts, ...redditPosts.value];
    if (youtubePosts.status === 'fulfilled') allPosts = [...allPosts, ...youtubePosts.value];

    // If no real data, use mock data for demo
    if (allPosts.length === 0) {
      logger.info('No real data scraped. Generating mock data for demo...');
      allPosts = generateMockPosts(20);
    }

    logger.info(`📦 Total raw posts collected: ${allPosts.length}`);

    const result = await savePosts(allPosts);

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    logger.info(`✅ Scraping complete: ${result.saved} saved, ${result.duplicates} duplicates, ${result.errors} errors (${duration}s)`);

    return result;
  } catch (error) {
    logger.error('Scraper error:', error);
    throw error;
  }
};

module.exports = { runScraper, savePosts };
