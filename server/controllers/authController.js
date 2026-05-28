const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../config/logger');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @route POST /api/auth/register
const register = async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ error: 'Email already registered.' });
  }

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);

  logger.info(`New user registered: ${email}`);

  res.status(201).json({
    message: 'Registration successful',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      preferences: user.preferences,
    },
  });
};

// @route POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  if (!user.isActive) {
    return res.status(403).json({ error: 'Account deactivated. Contact support.' });
  }

  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  const token = generateToken(user._id);
  logger.info(`User logged in: ${email}`);

  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      preferences: user.preferences,
      avatar: user.avatar,
    },
  });
};

// @route GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ user: req.user });
};

// @route PUT /api/auth/preferences
const updatePreferences = async (req, res) => {
  const { theme, language, notifications, defaultPlatforms, defaultCategories } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { preferences: { theme, language, notifications, defaultPlatforms, defaultCategories } } },
    { new: true, runValidators: true }
  );

  res.json({ message: 'Preferences updated', preferences: user.preferences });
};

// @route PUT /api/auth/change-password
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.comparePassword(currentPassword))) {
    return res.status(400).json({ error: 'Current password is incorrect.' });
  }

  user.password = newPassword;
  await user.save();

  res.json({ message: 'Password changed successfully.' });
};

module.exports = { register, login, getMe, updatePreferences, changePassword };
