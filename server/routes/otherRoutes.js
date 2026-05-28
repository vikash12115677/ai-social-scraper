const express = require('express');
const router1 = express.Router();
const router2 = express.Router();
const { translatePost, translateText } = require('../controllers/translationController');
const { authenticate } = require('../middleware/auth');
const Notification = require('../models/Notification');

// Translation routes
router1.post('/:postId', authenticate, translatePost);
router1.post('/', authenticate, translateText);

// Notification routes
router2.get('/', authenticate, async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id })
    .sort({ createdAt: -1 }).limit(20).lean();
  res.json({ notifications });
});

router2.put('/:id/read', authenticate, async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
  res.json({ message: 'Marked as read' });
});

router2.put('/read-all', authenticate, async (req, res) => {
  await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
  res.json({ message: 'All notifications marked as read' });
});

module.exports = { translationRoutes: router1, notificationRoutes: router2 };
