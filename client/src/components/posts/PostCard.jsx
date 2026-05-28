import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { savePost } from '../../redux/slices/postsSlice';
import { openTranslationModal } from '../../redux/slices/uiSlice';
import {
  formatDate, formatNumber, truncateText,
  getPlatformBadgeClass, PLATFORM_ICONS, SENTIMENT_EMOJIS,
} from '../../utils/helpers';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function PostCard({ post, index = 0 }) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((s) => s.auth);
  const [expanded, setExpanded] = useState(false);
  const [summary, setSummary] = useState(post.aiSummary || null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async () => {
    if (!isAuthenticated) { toast.error('Login to save posts'); return; }
    try {
      const result = await dispatch(savePost(post._id)).unwrap();
      setIsSaved(result.saved);
      toast.success(result.saved ? 'Post saved!' : 'Post removed from saved');
    } catch { toast.error('Failed to save post'); }
  };

  const handleSummarize = async () => {
    if (summary) return;
    setLoadingSummary(true);
    try {
      const { data } = await api.post(`/posts/${post._id}/summarize`);
      setSummary(data.summary);
    } catch { toast.error('Failed to generate summary'); }
    finally { setLoadingSummary(false); }
  };

  const handleTranslate = () => {
    dispatch(openTranslationModal(post));
  };

  const platformClass = getPlatformBadgeClass(post.platform);
  const icon = PLATFORM_ICONS[post.platform] || '🌐';
  const sentimentEmoji = SENTIMENT_EMOJIS[post.sentiment] || '😐';
  const contentToShow = expanded ? post.content : truncateText(post.content, 220);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.2 }}
      className="glass-card p-4 hover:bg-white/8 hover:border-white/15 transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500/40 to-purple-500/40 
                          flex items-center justify-center text-sm font-bold text-white shrink-0 border border-white/10">
            {post.username?.[0]?.toUpperCase() || '?'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">@{post.username}</p>
            <p className="text-xs text-gray-500">{formatDate(post.postedAt)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Platform badge */}
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${platformClass}`}>
            {icon} {post.platform}
          </span>
          {/* Sentiment */}
          <span className="text-sm" title={post.sentiment}>{sentimentEmoji}</span>
        </div>
      </div>

      {/* Content */}
      <div className="mb-3">
        <p className="text-sm text-gray-300 leading-relaxed">{contentToShow}</p>
        {post.content?.length > 220 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-blue-400 hover:text-blue-300 mt-1 transition-colors"
          >
            {expanded ? 'Show less ▲' : 'Show more ▼'}
          </button>
        )}
      </div>

      {/* AI Summary */}
      {summary && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 mb-3">
          <p className="text-xs text-blue-300 font-medium mb-1">✨ AI Summary</p>
          <p className="text-xs text-blue-100">{summary}</p>
        </div>
      )}

      {/* Category + Region tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        {post.category && post.category !== 'Uncategorized' && (
          <span className="text-xs bg-purple-500/15 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-full">
            {post.category}
          </span>
        )}
        {post.region && (
          <span className="text-xs bg-green-500/15 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">
            📍 {post.region}
          </span>
        )}
        {post.language && post.language !== 'en' && (
          <span className="text-xs bg-yellow-500/15 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded-full">
            🌐 {post.language}
          </span>
        )}
        {(post.hashtags || []).slice(0, 3).map((tag) => (
          <span key={tag} className="text-xs text-gray-500">#{tag.replace('#', '')}</span>
        ))}
      </div>

      {/* Engagement stats */}
      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3 border-t border-white/5 pt-3">
        <span>❤️ {formatNumber(post.engagement?.likes)}</span>
        <span>💬 {formatNumber(post.engagement?.comments)}</span>
        <span>🔄 {formatNumber(post.engagement?.shares || post.engagement?.retweets)}</span>
        {post.engagement?.views > 0 && <span>👁 {formatNumber(post.engagement?.views)}</span>}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleSummarize}
          disabled={loadingSummary || !!summary}
          className="btn-secondary py-1.5 text-xs disabled:opacity-50"
        >
          {loadingSummary ? '⏳' : '✨'} {summary ? 'Summarized' : 'Summarize'}
        </button>
        <button onClick={handleTranslate} className="btn-secondary py-1.5 text-xs">
          🌐 Translate
        </button>
        <button
          onClick={handleSave}
          className={`btn-secondary py-1.5 text-xs ml-auto ${isSaved ? 'text-yellow-400' : ''}`}
        >
          {isSaved ? '🔖 Saved' : '🔖 Save'}
        </button>
        {post.url && (
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary py-1.5 text-xs"
          >
            ↗
          </a>
        )}
      </div>
    </motion.div>
  );
}
