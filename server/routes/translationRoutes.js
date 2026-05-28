const express = require('express');
const router = express.Router();
const { translatePost, translateText } = require('../controllers/translationController');
const { authenticate } = require('../middleware/auth');

router.post('/text', authenticate, translateText);
router.post('/:postId', authenticate, translatePost);

module.exports = router;
