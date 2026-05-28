const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id })
    .sort({ createdAt: -1 }).limit(30).lean();
  const unreadCount = await Notification.countDocuments({ user: req.user._id, isRead: false });
  res.json({ notifications, unreadCount });
});

router.put('/:id/read', authenticate, async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
  res.json({ message: 'Marked as read' });
});

router.put('/mark-all-read', authenticate, async (req, res) => {
  await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
  res.json({ message: 'All notifications marked as read' });
});

module.exports = router;
