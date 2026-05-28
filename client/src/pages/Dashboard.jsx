import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchPosts, fetchPostStats, clearNewPostsCount } from '../redux/slices/postsSlice';
import { fetchAnalytics, fetchTrending } from '../redux/slices/analyticsSlice';
import StatsCard from '../components/dashboard/StatsCard';
import { PlatformChart, SentimentChart, EngagementChart } from '../components/analytics/AnalyticsChart';
import PostCard from '../components/posts/PostCard';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { items: posts, stats, loading, newPostsCount } = useSelector((s) => s.posts);
  const { overview, trending } = useSelector((s) => s.analytics);

  useEffect(() => {
    dispatch(fetchPostStats());
    dispatch(fetchPosts({ page: 1, limit: 6, sortBy: 'postedAt' }));
    dispatch(fetchAnalytics());
    dispatch(fetchTrending());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchPosts({ page: 1, limit: 6, sortBy: 'postedAt' }));
    dispatch(clearNewPostsCount());
  };

  const sentimentData = stats?.bySentiment || {};
  const totalPositive = sentimentData.positive || 0;
  const totalNegative = sentimentData.negative || 0;
  const totalNeutral = sentimentData.neutral || 0;
  const total = stats?.last24hCount || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">Passport social media intelligence overview</p>
        </div>
        <div className="flex items-center gap-3">
          {newPostsCount > 0 && (
            <button onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-xl text-sm hover:bg-blue-600/30 transition-all animate-pulse-glow">
              🔔 {newPostsCount} new post{newPostsCount > 1 ? 's' : ''}
            </button>
          )}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live monitoring
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Posts (24h)" value={total} icon="📊" color="blue" index={0}
          change={`${stats?.total?.toLocaleString() || 0} all time`} changeType="neutral" />
        <StatsCard title="Positive Sentiment" value={totalPositive} icon="😊" color="green" index={1}
          change={total > 0 ? `${Math.round((totalPositive / total) * 100)}%` : '0%'} changeType="positive" />
        <StatsCard title="Negative Sentiment" value={totalNegative} icon="😟" color="red" index={2}
          change={total > 0 ? `${Math.round((totalNegative / total) * 100)}%` : '0%'} changeType="negative" />
        <StatsCard title="Neutral Posts" value={totalNeutral} icon="😐" color="purple" index={3}
          change={total > 0 ? `${Math.round((totalNeutral / total) * 100)}%` : '0%'} changeType="neutral" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass-card p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-white mb-4">📈 Engagement Over Time</h3>
          <EngagementChart data={overview?.engagementByDay} />
        </div>
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">💬 Sentiment Distribution</h3>
          <SentimentChart data={stats?.bySentiment} />
        </div>
      </div>

      {/* Platform + Trending Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">🌐 Platform Distribution</h3>
          <PlatformChart data={stats?.byPlatform} />
        </div>

        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">🔥 Trending Hashtags</h3>
          {trending?.trendingHashtags?.length ? (
            <div className="space-y-2">
              {trending.trendingHashtags.slice(0, 8).map((h, i) => (
                <div key={h.tag} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-4">{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-blue-400 font-medium">{h.tag}</span>
                      <span className="text-xs text-gray-500">{h.count}</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500/60 rounded-full"
                        style={{ width: `${Math.round((h.count / (trending.trendingHashtags[0]?.count || 1)) * 100)}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 text-sm py-8">No trending hashtags yet</div>
          )}
        </div>
      </div>

      {/* Recent Posts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">📋 Recent Posts</h3>
          <a href="/posts" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">View all →</a>
        </div>
        {loading ? (
          <LoadingSkeleton count={6} />
        ) : posts.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {posts.slice(0, 6).map((post, i) => (
              <motion.div key={post._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}>
                <PostCard post={post} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="glass-card p-12 text-center">
      <div className="text-5xl mb-4">🛰️</div>
      <h3 className="text-lg font-semibold text-white mb-2">No posts yet</h3>
      <p className="text-gray-400 text-sm max-w-sm mx-auto">
        The scraper will collect passport-related posts automatically. Check back in a few minutes, or trigger a manual scrape.
      </p>
    </div>
  );
}
