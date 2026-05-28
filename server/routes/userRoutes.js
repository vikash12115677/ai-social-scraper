const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticate, authorize } = require('../middleware/auth');

// Get all users (admin only)
router.get('/', authenticate, authorize('admin'), async (req, res) => {
  const users = await User.find({}).select('-password').lean();
  res.json({ users });
});

// Update profile
router.put('/profile', authenticate, async (req, res) => {
  const { name, avatar } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { name, avatar } },
    { new: true }
  ).select('-password');
  res.json({ user, message: 'Profile updated' });
});

module.exports = router;
