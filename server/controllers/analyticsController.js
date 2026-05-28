const Post = require('../models/Post');

// @route GET /api/analytics/overview
const getOverview = async (req, res) => {
  const { startDate, endDate } = req.query;
  const start = startDate ? new Date(startDate) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const end = endDate ? new Date(endDate) : new Date();

  const matchFilter = { isSpam: false, postedAt: { $gte: start, $lte: end } };

  const [
    totalPosts,
    platformDist,
    sentimentDist,
    categoryDist,
    topHashtags,
    topKeywords,
    regionalActivity,
    engagementByDay,
    postsByDay,
  ] = await Promise.all([
    Post.countDocuments(matchFilter),

    Post.aggregate([
      { $match: matchFilter },
      { $group: { _id: '$platform', count: { $sum: 1 } } },
    ]),

    Post.aggregate([
      { $match: matchFilter },
      { $group: { _id: '$sentiment', count: { $sum: 1 } } },
    ]),

    Post.aggregate([
      { $match: matchFilter },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),

    Post.aggregate([
      { $match: { ...matchFilter, hashtags: { $exists: true, $ne: [] } } },
      { $unwind: '$hashtags' },
      { $group: { _id: '$hashtags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 15 },
    ]),

    Post.aggregate([
      { $match: { ...matchFilter, keywords: { $exists: true, $ne: [] } } },
      { $unwind: '$keywords' },
      { $group: { _id: '$keywords', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
    ]),

    Post.aggregate([
      { $match: { ...matchFilter, region: { $exists: true, $ne: '' } } },
      { $group: { _id: '$region', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),

    Post.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$postedAt' } },
          avgEngagement: { $avg: '$engagementScore' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),

    Post.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$postedAt' } },
            sentiment: '$sentiment',
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.date': 1 } },
    ]),
  ]);

  res.json({
    totalPosts,
    platformDistribution: platformDist.reduce((acc, i) => ({ ...acc, [i._id]: i.count }), {}),
    sentimentDistribution: sentimentDist.reduce((acc, i) => ({ ...acc, [i._id]: i.count }), {}),
    categoryDistribution: categoryDist.reduce((acc, i) => ({ ...acc, [i._id]: i.count }), {}),
    topHashtags: topHashtags.map(h => ({ tag: h._id, count: h.count })),
    topKeywords: topKeywords.map(k => ({ keyword: k._id, count: k.count })),
    regionalActivity: regionalActivity.map(r => ({ region: r._id, count: r.count })),
    engagementByDay,
    sentimentOverTime: postsByDay,
    dateRange: { start, end },
  });
};

// @route GET /api/analytics/trending
const getTrending = async (req, res) => {
  const last6h = new Date(Date.now() - 6 * 60 * 60 * 1000);

  const trendingHashtags = await Post.aggregate([
    { $match: { isSpam: false, postedAt: { $gte: last6h } } },
    { $unwind: '$hashtags' },
    { $group: { _id: '$hashtags', count: { $sum: 1 }, avgEngagement: { $avg: '$engagementScore' } } },
    { $sort: { count: -1, avgEngagement: -1 } },
    { $limit: 10 },
  ]);

  const trendingTopics = await Post.aggregate([
    { $match: { isSpam: false, postedAt: { $gte: last6h } } },
    { $group: { _id: '$category', count: { $sum: 1 }, avgSentimentScore: { $avg: '$sentimentScore' } } },
    { $sort: { count: -1 } },
  ]);

  res.json({
    trendingHashtags: trendingHashtags.map(h => ({ tag: h._id, count: h.count })),
    trendingTopics,
  });
};

module.exports = { getOverview, getTrending };
