const OpenAI = require('openai');
const logger = require('../config/logger');

// Initialize OpenAI client
let openai = null;
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-your-openai-api-key-here') {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

// Language map for translation
const LANGUAGE_NAMES = {
  en: 'English', hi: 'Hindi', pa: 'Punjabi', es: 'Spanish',
  fr: 'French', de: 'German', ar: 'Arabic', zh: 'Chinese',
  ru: 'Russian', ja: 'Japanese',
};

// Categories for classification
const CATEGORIES = [
  'Passport Application', 'Passport Renewal', 'Tatkal', 'Visa',
  'Travel Issues', 'Government Announcements', 'Scam/Fraud',
  'News', 'Personal Experiences',
];

// Call OpenAI with fallback for no API key
const callOpenAI = async (prompt, systemPrompt = '', maxTokens = 200) => {
  if (!openai) {
    logger.warn('OpenAI API key not configured. Using mock response.');
    return null;
  }
  try {
    const messages = [];
    if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
    messages.push({ role: 'user', content: prompt });

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: maxTokens,
      temperature: 0.3,
    });
    return response.choices[0].message.content.trim();
  } catch (error) {
    logger.error('OpenAI API error:', error.message);
    return null;
  }
};

// Generate 30-word AI summary
const generateSummary = async (content) => {
  if (!content) return '';
  const result = await callOpenAI(
    `Summarize this social media post in exactly 30 words or less: "${content.substring(0, 500)}"`,
    'You are a concise summarizer. Return only the summary, no extra text.',
    60
  );
  return result || content.substring(0, 150) + '...';
};

// Detect sentiment
const analyzeSentiment = async (content) => {
  if (!content) return { sentiment: 'neutral', score: 0 };

  const result = await callOpenAI(
    `Analyze the sentiment of this text about passport/travel: "${content.substring(0, 400)}"\nRespond with JSON only: {"sentiment": "positive|negative|neutral", "score": 0.0}`,
    'You are a sentiment analyzer. Respond only with valid JSON.',
    50
  );

  try {
    if (result) {
      const parsed = JSON.parse(result.replace(/```json|```/g, '').trim());
      return { sentiment: parsed.sentiment || 'neutral', score: parsed.score || 0 };
    }
  } catch (_) {}

  // Fallback: keyword-based
  const text = content.toLowerCase();
  const positiveWords = ['approved', 'received', 'happy', 'great', 'excellent', 'fast', 'helpful', 'thanks'];
  const negativeWords = ['rejected', 'delay', 'problem', 'issue', 'scam', 'fraud', 'failed', 'terrible', 'waiting'];
  const posScore = positiveWords.filter(w => text.includes(w)).length;
  const negScore = negativeWords.filter(w => text.includes(w)).length;
  if (posScore > negScore) return { sentiment: 'positive', score: 0.5 };
  if (negScore > posScore) return { sentiment: 'negative', score: -0.5 };
  return { sentiment: 'neutral', score: 0 };
};

// Auto-categorize post
const categorizePost = async (content) => {
  if (!content) return 'Uncategorized';

  const result = await callOpenAI(
    `Categorize this passport-related social media post into ONE category from this list: ${CATEGORIES.join(', ')}\n\nPost: "${content.substring(0, 400)}"\n\nRespond with only the category name.`,
    'You are a passport post categorizer. Respond only with the exact category name from the provided list.',
    30
  );

  if (result && CATEGORIES.includes(result.trim())) return result.trim();

  // Fallback keyword-based
  const text = content.toLowerCase();
  if (text.includes('tatkal')) return 'Tatkal';
  if (text.includes('renew') || text.includes('renewal')) return 'Passport Renewal';
  if (text.includes('apply') || text.includes('application') || text.includes('apply')) return 'Passport Application';
  if (text.includes('visa')) return 'Visa';
  if (text.includes('scam') || text.includes('fraud') || text.includes('fake')) return 'Scam/Fraud';
  if (text.includes('delay') || text.includes('cancel') || text.includes('issue')) return 'Travel Issues';
  if (text.includes('government') || text.includes('ministry') || text.includes('official')) return 'Government Announcements';
  return 'Personal Experiences';
};

// Detect spam
const detectSpam = async (content) => {
  if (!content || content.length < 10) return { isSpam: true, score: 0.9 };

  // Simple heuristics first
  const spamPatterns = [
    /(.)\1{10,}/, // Repeated characters
    /^[^a-zA-Z]*$/, // No letters
    /https?:\/\/[^\s]+\s*https?:\/\/[^\s]+\s*https?:\/\//, // Multiple URLs
  ];

  for (const pattern of spamPatterns) {
    if (pattern.test(content)) return { isSpam: true, score: 0.9 };
  }

  const result = await callOpenAI(
    `Is this social media post spam/gibberish? "${content.substring(0, 300)}"\nRespond with JSON: {"isSpam": true/false, "score": 0.0-1.0}`,
    'You detect spam. JSON only.',
    40
  );

  try {
    if (result) {
      const parsed = JSON.parse(result.replace(/```json|```/g, '').trim());
      return { isSpam: parsed.isSpam || false, score: parsed.score || 0 };
    }
  } catch (_) {}

  return { isSpam: false, score: 0.1 };
};

// Translate content
const translateContent = async (content, targetLanguage, sourceLanguage = 'auto') => {
  if (!content) return '';
  const targetName = LANGUAGE_NAMES[targetLanguage] || targetLanguage;

  const result = await callOpenAI(
    `Translate this text to ${targetName}: "${content.substring(0, 800)}"`,
    `You are a translator. Translate accurately to ${targetName}. Return only the translated text.`,
    400
  );

  return result || content; // Fallback to original
};

// Extract keywords and hashtags
const extractKeywords = async (content) => {
  const hashtags = (content.match(/#\w+/g) || []).map(h => h.toLowerCase());
  const mentions = (content.match(/@\w+/g) || []);

  const result = await callOpenAI(
    `Extract 5-10 important keywords from this passport/travel post: "${content.substring(0, 400)}"\nRespond with JSON: {"keywords": ["keyword1", "keyword2"]}`,
    'Extract keywords. JSON only.',
    80
  );

  let keywords = [];
  try {
    if (result) {
      const parsed = JSON.parse(result.replace(/```json|```/g, '').trim());
      keywords = parsed.keywords || [];
    }
  } catch (_) {
    keywords = content.toLowerCase().match(/\b(passport|visa|renewal|tatkal|application|travel|delay|appointment)\b/g) || [];
  }

  return { keywords: [...new Set(keywords)], hashtags, mentions };
};

// Process a full post with all AI features
const processPost = async (post) => {
  try {
    const [sentiment, category, spamCheck, extracted] = await Promise.all([
      analyzeSentiment(post.content),
      categorizePost(post.content),
      detectSpam(post.content),
      extractKeywords(post.content),
    ]);

    let summary = '';
    if (!spamCheck.isSpam) {
      summary = await generateSummary(post.content);
    }

    return {
      sentiment: sentiment.sentiment,
      sentimentScore: sentiment.score,
      category,
      isSpam: spamCheck.isSpam,
      spamScore: spamCheck.score,
      aiSummary: summary,
      keywords: extracted.keywords,
      hashtags: [...new Set([...post.hashtags || [], ...extracted.hashtags])],
      mentions: extracted.mentions,
      isProcessed: true,
      processedAt: new Date(),
    };
  } catch (error) {
    logger.error('Error processing post with AI:', error);
    return {
      sentiment: 'neutral',
      sentimentScore: 0,
      category: 'Uncategorized',
      isSpam: false,
      spamScore: 0,
      isProcessed: true,
      processedAt: new Date(),
    };
  }
};

module.exports = {
  generateSummary,
  analyzeSentiment,
  categorizePost,
  detectSpam,
  translateContent,
  extractKeywords,
  processPost,
};
