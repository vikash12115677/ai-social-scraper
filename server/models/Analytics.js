const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  date: { type: Date, required: true, index: true },
  period: { type: String, enum: ['hourly', 'daily', 'weekly'], default: 'daily' },
  totalPosts: { type: Number, default: 0 },
  platformDistribution: {
    twitter: { type: Number, default: 0 },
    reddit: { type: Number, default: 0 },
    youtube: { type: Number, default: 0 },
    linkedin: { type: Number, default: 0 },
    instagram: { type: Number, default: 0 },
    facebook: { type: Number, default: 0 },
    tiktok: { type: Number, default: 0 },
  },
  sentimentDistribution: {
    positive: { type: Number, default: 0 },
    negative: { type: Number, default: 0 },
    neutral: { type: Number, default: 0 },
  },
  categoryDistribution: { type: Map, of: Number },
  topHashtags: [{
    tag: String,
    count: Number,
  }],
  topKeywords: [{
    keyword: String,
    count: Number,
  }],
  regionalActivity: [{
    region: String,
    count: Number,
  }],
  avgEngagement: { type: Number, default: 0 },
  spamCount: { type: Number, default: 0 },
}, { timestamps: true });

analyticsSchema.index({ date: -1, period: 1 }, { unique: true });

module.exports = mongoose.model('Analytics', analyticsSchema);
