const cron = require('node-cron');
const { runScraper } = require('../scrapers/scraperService');
const { emitNewPosts, emitScrapeStatus } = require('../config/socket');
const Post = require('../models/Post');
const logger = require('../config/logger');

let isRunning = false;

const executeScrapingJob = async (io) => {
  if (isRunning) {
    logger.warn('⏳ Scraping job already running, skipping...');
    return;
  }

  isRunning = true;
  const startTime = Date.now();

  // Emit start status
  emitScrapeStatus({ status: 'running', message: 'Scraping started...', timestamp: new Date() });

  try {
    const result = await runScraper();

    // Fetch newly added posts to emit
    if (result.saved > 0) {
      const newPosts = await Post.find({
        createdAt: { $gte: new Date(startTime - 5000) },
        isSpam: false,
      })
        .sort({ postedAt: -1 })
        .limit(result.saved)
        .lean();

      emitNewPosts(newPosts);
    }

    emitScrapeStatus({
      status: 'completed',
      message: `Scraping completed: ${result.saved} new posts`,
      result,
      duration: Date.now() - startTime,
      timestamp: new Date(),
    });

    logger.info(`🎉 Cron job completed: ${result.saved} new posts in ${Date.now() - startTime}ms`);
  } catch (error) {
    logger.error('Cron job failed:', error);
    emitScrapeStatus({ status: 'error', message: error.message, timestamp: new Date() });
  } finally {
    isRunning = false;
  }
};

const startCronJobs = (io) => {
  const schedule = process.env.SCRAPE_INTERVAL || '*/30 * * * *';

  logger.info(`⏰ Cron job scheduled: ${schedule}`);

  // Schedule cron job
  cron.schedule(schedule, () => {
    logger.info('⏰ Cron job triggered');
    executeScrapingJob(io);
  });

  // Run immediately on startup after 5s delay
  setTimeout(() => {
    logger.info('🚀 Running initial scrape...');
    executeScrapingJob(io);
  }, 5000);
};

// Manual trigger endpoint support
const triggerManualScrape = async () => {
  return executeScrapingJob(null);
};

module.exports = { startCronJobs, triggerManualScrape };
