const Post = require('../models/Post');
const { createObjectCsvWriter } = require('csv-writer');
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');
const logger = require('../config/logger');

// Helper to build filter
const buildExportFilter = (query) => {
  const filter = { isSpam: false };
  const { platform, sentiment, category, startDate, endDate } = query;
  if (platform) filter.platform = { $in: platform.split(',') };
  if (sentiment) filter.sentiment = { $in: sentiment.split(',') };
  if (category) filter.category = { $in: category.split(',') };
  if (startDate || endDate) {
    filter.postedAt = {};
    if (startDate) filter.postedAt.$gte = new Date(startDate);
    if (endDate) filter.postedAt.$lte = new Date(endDate);
  }
  return filter;
};

// @route GET /api/export/csv
const exportCSV = async (req, res) => {
  const filter = buildExportFilter(req.query);
  const limit = Math.min(parseInt(req.query.limit) || 500, 2000);

  const posts = await Post.find(filter)
    .sort({ postedAt: -1 })
    .limit(limit)
    .lean();

  if (!posts.length) {
    return res.status(404).json({ error: 'No posts found for the given filters' });
  }

  const tmpFile = path.join('/tmp', `export_${Date.now()}.csv`);

  const csvWriter = createObjectCsvWriter({
    path: tmpFile,
    header: [
      { id: 'platform', title: 'Platform' },
      { id: 'username', title: 'Username' },
      { id: 'content', title: 'Content' },
      { id: 'aiSummary', title: 'AI Summary' },
      { id: 'sentiment', title: 'Sentiment' },
      { id: 'category', title: 'Category' },
      { id: 'language', title: 'Language' },
      { id: 'region', title: 'Region' },
      { id: 'likes', title: 'Likes' },
      { id: 'comments', title: 'Comments' },
      { id: 'shares', title: 'Shares' },
      { id: 'hashtags', title: 'Hashtags' },
      { id: 'postedAt', title: 'Posted At' },
      { id: 'url', title: 'URL' },
    ],
  });

  const records = posts.map(p => ({
    platform: p.platform,
    username: p.username,
    content: p.content?.replace(/[\n\r,]/g, ' '),
    aiSummary: p.aiSummary || '',
    sentiment: p.sentiment,
    category: p.category,
    language: p.language,
    region: p.region || '',
    likes: p.engagement?.likes || 0,
    comments: p.engagement?.comments || 0,
    shares: p.engagement?.shares || 0,
    hashtags: (p.hashtags || []).join(' '),
    postedAt: p.postedAt?.toISOString(),
    url: p.url || '',
  }));

  await csvWriter.writeRecords(records);

  res.download(tmpFile, `passport_posts_${Date.now()}.csv`, (err) => {
    if (err) logger.error('CSV download error:', err);
    fs.unlink(tmpFile, () => {});
  });
};

// @route GET /api/export/pdf
const exportPDF = async (req, res) => {
  const filter = buildExportFilter(req.query);
  const limit = Math.min(parseInt(req.query.limit) || 50, 100);

  const posts = await Post.find(filter)
    .sort({ postedAt: -1 })
    .limit(limit)
    .lean();

  if (!posts.length) {
    return res.status(404).json({ error: 'No posts found for the given filters' });
  }

  const doc = new PDFDocument({ margin: 50, size: 'A4' });
  const filename = `passport_report_${Date.now()}.pdf`;

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  doc.pipe(res);

  // Title
  doc.fontSize(20).fillColor('#1a56db').text('AI Passport Social Media Report', { align: 'center' });
  doc.moveDown(0.5);
  doc.fontSize(10).fillColor('#6b7280').text(`Generated: ${new Date().toLocaleString()} | Posts: ${posts.length}`, { align: 'center' });
  doc.moveDown(1);

  // Summary Box
  const sentiments = posts.reduce((acc, p) => {
    acc[p.sentiment] = (acc[p.sentiment] || 0) + 1; return acc;
  }, {});
  doc.fontSize(12).fillColor('#111827').text('Summary', { underline: true });
  doc.fontSize(10).fillColor('#374151');
  doc.text(`Total Posts: ${posts.length}  |  Positive: ${sentiments.positive || 0}  |  Negative: ${sentiments.negative || 0}  |  Neutral: ${sentiments.neutral || 0}`);
  doc.moveDown(1);

  // Posts
  posts.forEach((post, idx) => {
    if (doc.y > 700) doc.addPage();

    doc.fontSize(11).fillColor('#1f2937')
      .text(`${idx + 1}. @${post.username} [${post.platform?.toUpperCase()}]`, { continued: false });

    doc.fontSize(9).fillColor('#4b5563')
      .text(post.content?.substring(0, 300) + (post.content?.length > 300 ? '...' : ''));

    if (post.aiSummary) {
      doc.fontSize(9).fillColor('#2563eb').text(`Summary: ${post.aiSummary}`);
    }

    doc.fontSize(8).fillColor('#9ca3af')
      .text(`Sentiment: ${post.sentiment} | Category: ${post.category} | ${post.postedAt?.toLocaleDateString()}`);

    doc.moveDown(0.8);
    doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#e5e7eb').stroke();
    doc.moveDown(0.5);
  });

  doc.end();
};

module.exports = { exportCSV, exportPDF };
