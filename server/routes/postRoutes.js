const express = require('express');
const router = express.Router();
const {
  getPosts, getPost, searchPosts, savePost, getSavedPosts, summarizePost, getPostStats,
} = require('../controllers/postController');
const { authenticate } = require('../middleware/auth');
const { triggerManualScrape } = require('../jobs/scraperJob');

router.get('/', getPosts);
router.get('/stats', getPostStats);
router.get('/saved', authenticate, getSavedPosts);
router.get('/:id', getPost);
router.post('/search', searchPosts);
router.post('/:id/save', authenticate, savePost);
router.post('/:id/summarize', authenticate, summarizePost);

// Admin: manual scrape trigger
router.post('/admin/scrape', authenticate, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin only' });
  }
  res.json({ message: 'Scraping triggered' });
  triggerManualScrape(); // Non-blocking
});

module.exports = router;
