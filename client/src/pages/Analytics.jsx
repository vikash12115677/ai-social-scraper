import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchAnalytics, fetchTrending, setDateRange } from '../redux/slices/analyticsSlice';
import {
  PlatformChart, SentimentChart, EngagementChart, CategoryChart,
} from '../components/analytics/AnalyticsChart';

export default function Analytics() {
  const dispatch = useDispatch();
  const { overview, trending, loading, dateRange } = useSelector((s) => s.analytics);

  useEffect(() => {
    dispatch(fetchAnalytics({ startDate: dateRange.startDate, endDate: dateRange.endDate }));
    dispatch(fetchTrending());
  }, [dispatch, dateRange]);

  const handleDateChange = (field, value) => {
    dispatch(setDateRange({ ...dateRange, [field]: value }));
  };

  const totalPosts = overview?.totalPosts || 0;
  const sentData = overview?.sentimentDistribution || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-sm text-gray-400 mt-0.5">Deep insights on passport social media activity</p>
        </div>
        {/* Date Range Picker */}
        <div className="flex items-center gap-2">
          <input type="date" value={dateRange.startDate}
            onChange={(e) => handleDateChange('startDate', e.target.value)}
            className="input-field w-auto text-xs" />
          <span className="text-gray-500 text-sm">→</span>
          <input type="date" value={dateRange.endDate}
            onChange={(e) => handleDateChange('endDate', e.target.value)}
            className="input-field w-auto text-xs" />
        </div>
      </div>

      {/* Overview Numbers */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Posts', value: totalPosts, icon: '📊', color: 'from-blue-600/20 to-blue-800/20', border: 'border-blue-500/20' },
          { label: 'Positive', value: sentData.positive || 0, icon: '✅', color: 'from-emerald-600/20 to-emerald-800/20', border: 'border-emerald-500/20' },
          { label: 'Negative', value: sentData.negative || 0, icon: '⚠️', color: 'from-red-600/20 to-red-800/20', border: 'border-red-500/20' },
          { label: 'Neutral', value: sentData.neutral || 0, icon: '➖', color: 'from-yellow-600/20 to-yellow-800/20', border: 'border-yellow-500/20' },
        ].map((item, i) => (
          <motion.div key={item.label}
            className={`glass-card p-4 bg-gradient-to-br ${item.color} border ${item.border}`}
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.07 }}>
            <div className="text-2xl mb-1">{item.icon}</div>
            <div className="text-xl font-bold text-white">{item.value.toLocaleString()}</div>
            <div className="text-xs text-gray-400">{item.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">📈 Posts & Engagement Over Time</h3>
          {loading ? <div className="h-48 skeleton rounded-xl" /> : <EngagementChart data={overview?.engagementByDay} />}
        </div>

        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">💬 Sentiment Distribution</h3>
          {loading ? <div className="h-48 skeleton rounded-xl" /> : <SentimentChart data={overview?.sentimentDistribution} />}
        </div>

        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">🌐 Platform Breakdown</h3>
          {loading ? <div className="h-48 skeleton rounded-xl" /> : <PlatformChart data={overview?.platformDistribution} />}
        </div>

        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">🗂️ Category Distribution</h3>
          {loading ? <div className="h-48 skeleton rounded-xl" /> : <CategoryChart data={overview?.categoryDistribution} />}
        </div>
      </div>

      {/* Keywords + Regional Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Keywords */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">🏷️ Top Keywords</h3>
          {overview?.topKeywords?.length ? (
            <div className="flex flex-wrap gap-2">
              {overview.topKeywords.map((k, i) => {
                const maxCount = overview.topKeywords[0]?.count || 1;
                const size = Math.max(10, Math.round(10 + (k.count / maxCount) * 10));
                return (
                  <span key={k.keyword}
                    className="px-3 py-1.5 bg-blue-600/20 border border-blue-500/20 text-blue-300 rounded-full"
                    style={{ fontSize: `${size}px` }}>
                    {k.keyword}
                    <span className="ml-1 text-blue-500 text-xs">({k.count})</span>
                  </span>
                );
              })}
            </div>
          ) : <EmptyChart />}
        </div>

        {/* Regional Activity */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">🗺️ Regional Activity</h3>
          {overview?.regionalActivity?.length ? (
            <div className="space-y-3">
              {overview.regionalActivity.map((r, i) => {
                const maxCount = overview.regionalActivity[0]?.count || 1;
                const pct = Math.round((r.count / maxCount) * 100);
                return (
                  <div key={r.region} className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-5">{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-gray-300">{r.region}</span>
                        <span className="text-xs text-gray-500">{r.count}</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all"
                          style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : <EmptyChart />}
        </div>
      </div>

      {/* Trending Section */}
      {trending && (
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">🔥 Trending Now (Last 6h)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {trending.trendingHashtags?.slice(0, 12).map((h) => (
              <div key={h.tag} className="glass-card-hover p-3 text-center rounded-xl">
                <p className="text-xs text-blue-400 font-medium truncate">{h.tag}</p>
                <p className="text-xs text-gray-500 mt-1">{h.count} posts</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyChart() {
  return <div className="text-center text-gray-500 text-sm py-8">No data available yet</div>;
}
