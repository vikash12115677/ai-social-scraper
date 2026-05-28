const Post = require('../models/Post');
const User = require('../models/User');
const aiService = require('../ai/aiService');
const logger = require('../config/logger');

// Build filter query from request params
const buildFilterQuery = (query) => {
  const filter = { isSpam: false };
  const {
    platform, sentiment, category, language,
    region, search, startDate, endDate,
    minEngagement, maxEngagement,
  } = query;

  if (platform) filter.platform = { $in: platform.split(',') };
  if (sentiment) filter.sentiment = { $in: sentiment.split(',') };
  if (category) filter.category = { $in: category.split(',') };
  if (language) filter.language = { $in: language.split(',') };
  if (region) filter.region = { $regex: region, $options: 'i' };

  if (startDate || endDate) {
    filter.postedAt = {};
    if (startDate) filter.postedAt.$gte = new Date(startDate);
    if (endDate) filter.postedAt.$lte = new Date(endDate);
  }

  if (minEngagement || maxEngagement) {
    filter.engagementScore = {};
    if (minEngagement) filter.engagementScore.$gte = parseInt(minEngagement);
    if (maxEngagement) filter.engagementScore.$lte = parseInt(maxEngagement);
  }

  if (search) {
    filter.$text = { $search: search };
  }

  return filter;
};

// @route GET /api/posts
const getPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const sortBy = req.query.sortBy || 'postedAt';
  const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

  const filter = buildFilterQuery(req.query);

  const [posts, total] = await Promise.all([
    Post.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean(),
    Post.countDocuments(filter),
  ]);

  res.json({
    posts,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    },
  });
};

// @route GET /api/posts/:id
const getPost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json({ post });
};

// @route POST /api/posts/search
const searchPosts = async (req, res) => {
  const { query, page = 1, limit = 20 } = req.body;

  if (!query || query.trim().length < 2) {
    return res.status(400).json({ error: 'Search query must be at least 2 characters' });
  }

  const skip = (page - 1) * limit;
  const filter = {
    isSpam: false,
    $or: [
      { content: { $regex: query, $options: 'i' } },
      { username: { $regex: query, $options: 'i' } },
      { hashtags: { $in: [new RegExp(query, 'i')] } },
      { keywords: { $in: [new RegExp(query, 'i')] } },
    ],
  };

  const [posts, total] = await Promise.all([
    Post.find(filter).sort({ postedAt: -1 }).skip(skip).limit(limit).lean(),
    Post.countDocuments(filter),
  ]);

  res.json({ posts, total, query, page, limit });
};

// @route POST /api/posts/:id/save
const savePost = async (req, res) => {
  const user = await User.findById(req.user._id);
  const postId = req.params.id;

  const isSaved = user.savedPosts.includes(postId);

  if (isSaved) {
    user.savedPosts = user.savedPosts.filter(id => id.toString() !== postId);
    await user.save();
    return res.json({ message: 'Post removed from saved', saved: false });
  }

  user.savedPosts.push(postId);
  await user.save();
  res.json({ message: 'Post saved', saved: true });
};

// @route GET /api/posts/saved
const getSavedPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const user = await User.findById(req.user._id);
  const total = user.savedPosts.length;

  const posts = await Post.find({ _id: { $in: user.savedPosts } })
    .sort({ postedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  res.json({
    posts,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
};

// @route POST /api/posts/:id/summarize
const summarizePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  if (post.aiSummary) {
    return res.json({ summary: post.aiSummary, cached: true });
  }

  const summary = await aiService.generateSummary(post.content);
  post.aiSummary = summary;
  await post.save();

  res.json({ summary, cached: false });
};

// @route GET /api/posts/stats
const getPostStats = async (req, res) => {
  const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [total, last24hCount, byPlatform, bySentiment, byCategory] = await Promise.all([
    Post.countDocuments({ isSpam: false }),
    Post.countDocuments({ isSpam: false, postedAt: { $gte: last24h } }),
    Post.aggregate([
      { $match: { isSpam: false, postedAt: { $gte: last24h } } },
      { $group: { _id: '$platform', count: { $sum: 1 } } },
    ]),
    Post.aggregate([
      { $match: { isSpam: false, postedAt: { $gte: last24h } } },
      { $group: { _id: '$sentiment', count: { $sum: 1 } } },
    ]),
    Post.aggregate([
      { $match: { isSpam: false, postedAt: { $gte: last24h } } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
  ]);

  res.json({
    total,
    last24hCount,
    byPlatform: byPlatform.reduce((acc, item) => ({ ...acc, [item._id]: item.count }), {}),
    bySentiment: bySentiment.reduce((acc, item) => ({ ...acc, [item._id]: item.count }), {}),
    byCategory: byCategory.reduce((acc, item) => ({ ...acc, [item._id]: item.count }), {}),
  });
};

module.exports = { getPosts, getPost, searchPosts, savePost, getSavedPosts, summarizePost, getPostStats };
