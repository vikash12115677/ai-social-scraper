const Post = require('../models/Post');
const aiService = require('../ai/aiService');

// @route POST /api/translate/:postId
const translatePost = async (req, res) => {
  const { targetLanguage } = req.body;
  const { postId } = req.params;

  if (!targetLanguage) {
    return res.status(400).json({ error: 'Target language is required' });
  }

  const post = await Post.findById(postId);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  // If already in target language
  if (post.language === targetLanguage) {
    return res.json({ translation: post.content, cached: true, targetLanguage });
  }

  const translation = await aiService.translateContent(post.content, targetLanguage);

  // Cache translation on post
  post.translatedContent = translation;
  await post.save();

  res.json({ translation, cached: false, targetLanguage, postId });
};

// @route POST /api/translate/text
const translateText = async (req, res) => {
  const { text, targetLanguage, sourceLanguage } = req.body;

  if (!text || !targetLanguage) {
    return res.status(400).json({ error: 'Text and target language are required' });
  }

  const translation = await aiService.translateContent(text, targetLanguage, sourceLanguage);
  res.json({ translation, targetLanguage, sourceLanguage });
};

module.exports = { translatePost, translateText };
