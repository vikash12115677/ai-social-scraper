const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: {
    type: String,
    enum: ['new_posts', 'scrape_complete', 'alert', 'system', 'trending'],
    required: true,
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed },
  isRead: { type: Boolean, default: false, index: true },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
}, { timestamps: true });

notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
