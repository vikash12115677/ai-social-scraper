import { formatDistanceToNow, format } from 'date-fns';

export const PLATFORMS = ['twitter', 'reddit', 'youtube', 'linkedin', 'instagram', 'facebook', 'tiktok'];
export const SENTIMENTS = ['positive', 'negative', 'neutral'];
export const CATEGORIES = [
  'Passport Application', 'Passport Renewal', 'Tatkal', 'Visa',
  'Travel Issues', 'Government Announcements', 'Scam/Fraud', 'News', 'Personal Experiences',
];
export const LANGUAGES = [
  { code: 'en', name: 'English' }, { code: 'hi', name: 'Hindi' },
  { code: 'pa', name: 'Punjabi' }, { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' }, { code: 'de', name: 'German' },
  { code: 'ar', name: 'Arabic' }, { code: 'zh', name: 'Chinese' },
  { code: 'ru', name: 'Russian' }, { code: 'ja', name: 'Japanese' },
];

export const PLATFORM_ICONS = {
  twitter: '𝕏', reddit: '👽', youtube: '▶', linkedin: 'in',
  instagram: '📸', facebook: '𝐟', tiktok: '♪', mock: '🔧',
};

export const PLATFORM_COLORS = {
  twitter: '#1da1f2', reddit: '#ff4500', youtube: '#ff0000',
  linkedin: '#0077b5', instagram: '#e1306c', facebook: '#1877f2',
  tiktok: '#00f2ea', mock: '#6b7280',
};

export const SENTIMENT_COLORS = {
  positive: '#10b981', negative: '#ef4444', neutral: '#f59e0b',
};

export const SENTIMENT_EMOJIS = { positive: '😊', negative: '😞', neutral: '😐' };

export const formatDate = (date) => {
  if (!date) return '';
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch {
    return '';
  }
};

export const formatFullDate = (date) => {
  if (!date) return '';
  try {
    return format(new Date(date), 'MMM dd, yyyy HH:mm');
  } catch {
    return '';
  }
};

export const formatNumber = (num) => {
  if (!num) return '0';
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export const truncateText = (text, maxLen = 200) => {
  if (!text) return '';
  return text.length > maxLen ? text.substring(0, maxLen) + '...' : text;
};

export const getPlatformBadgeClass = (platform) => `badge-${platform?.toLowerCase() || 'mock'}`;

export const getSentimentClass = (sentiment) => `sentiment-${sentiment || 'neutral'}`;

export const buildQueryString = (params) => {
  const q = Object.entries(params)
    .filter(([, v]) => v !== '' && v !== null && v !== undefined)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
  return q ? `?${q}` : '';
};

export const chartColors = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
  '#8b5cf6', '#06b6d4', '#f97316', '#84cc16',
];
