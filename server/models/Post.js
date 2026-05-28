const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  // Source Info
  platform: {
    type: String,
    enum: ['twitter', 'reddit', 'youtube', 'linkedin', 'instagram', 'facebook', 'tiktok', 'mock'],
    required: true,
    index: true,
  },
  postId: { type: String, required: true }, // Original platform post ID
  url: { type: String },

  // Author Info
  username: { type: String, required: true },
  displayName: { type: String },
  profileImage: { type: String, default: '' },
  verified: { type: Boolean, default: false },

  // Content
  content: { type: String, required: true },
  originalContent: { type: String }, // Before cleaning
  translatedContent: { type: String },
  aiSummary: { type: String }, // 30-word AI summary

  // AI Analysis
  sentiment: {
    type: String,
    enum: ['positive', 'negative', 'neutral'],
    default: 'neutral',
    index: true,
  },
  sentimentScore: { type: Number, min: -1, max: 1, default: 0 },
  category: {
    type: String,
    enum: [
      'Passport Application',
      'Passport Renewal',
      'Tatkal',
      'Visa',
      'Travel Issues',
      'Government Announcements',
      'Scam/Fraud',
      'News',
      'Personal Experiences',
      'Uncategorized',
    ],
    default: 'Uncategorized',
    index: true,
  },
  spamScore: { type: Number, min: 0, max: 1, default: 0 },
  isSpam: { type: Boolean, default: false, index: true },
  clusterId: { type: String }, // Cluster group ID for similar posts

  // Language & Region
  language: { type: String, default: 'en', index: true },
  detectedLanguage: { type: String },
  region: { type: String, index: true },
  country: { type: String },

  // Engagement Metrics
  engagement: {
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    retweets: { type: Number, default: 0 },
    upvotes: { type: Number, default: 0 },
  },
  engagementScore: { type: Number, default: 0 }, // Computed score

  // Tags & Keywords
  hashtags: [{ type: String }],
  keywords: [{ type: String }],
  mentions: [{ type: String }],

  // Media
  images: [{ type: String }],
  videoUrl: { type: String },

  // Metadata
  postedAt: { type: Date, required: true, index: true },
  scrapedAt: { type: Date, default: Date.now },
  processedAt: { type: Date },
  isProcessed: { type: Boolean, default: false, index: true },

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Compound index to prevent duplicates
postSchema.index({ platform: 1, postId: 1 }, { unique: true });
postSchema.index({ postedAt: -1 });
postSchema.index({ createdAt: -1 });

// Virtual: total engagement
postSchema.virtual('totalEngagement').get(function () {
  const e = this.engagement;
  return (e.likes || 0) + (e.comments || 0) + (e.shares || 0) + (e.retweets || 0) + (e.upvotes || 0);
});

// Pre-save: compute engagement score
postSchema.pre('save', function (next) {
  const e = this.engagement;
  this.engagementScore =
    (e.likes || 0) * 1 +
    (e.comments || 0) * 2 +
    (e.shares || 0) * 3 +
    (e.retweets || 0) * 2 +
    (e.upvotes || 0) * 1.5 +
    (e.views || 0) * 0.01;
  next();
});

module.exports = mongoose.model('Post', postSchema);
