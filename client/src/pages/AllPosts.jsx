import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchPosts, clearNewPostsCount } from '../redux/slices/postsSlice';
import PostCard from '../components/posts/PostCard';
import FilterBar from '../components/posts/FilterBar';
import SearchBar from '../components/posts/SearchBar';
import Pagination from '../components/common/Pagination';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function AllPosts() {
  const dispatch = useDispatch();
  const { items: posts, loading, pagination, filters, newPostsCount } = useSelector((s) => s.posts);
  const { user } = useSelector((s) => s.auth);
  const [showFilters, setShowFilters] = useState(false);
  const [exporting, setExporting] = useState(null);

  // Reload whenever filters change
  useEffect(() => {
    const params = {};
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
    dispatch(fetchPosts(params));
  }, [filters, dispatch]);

  const handleExport = async (format) => {
    setExporting(format);
    try {
      const params = new URLSearchParams();
      if (filters.platform) params.append('platform', filters.platform);
      if (filters.sentiment) params.append('sentiment', filters.sentiment);
      if (filters.category) params.append('category', filters.category);

      const response = await api.get(`/export/${format}?${params}`, { responseType: 'blob' });
      const url = URL.createObjectURL(response.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `passport_posts_${Date.now()}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`${format.toUpperCase()} exported successfully`);
    } catch {
      toast.error('Export failed. Please try again.');
    } finally {
      setExporting(null);
    }
  };

  const activeFiltersCount = [filters.platform, filters.sentiment, filters.category, filters.language]
    .filter(Boolean).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">All Posts</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {pagination?.total?.toLocaleString() || 0} passport-related posts
          </p>
        </div>
        <div className="flex gap-2">
          {user && (
            <>
              <button onClick={() => handleExport('csv')} disabled={!!exporting}
                className="btn-secondary text-xs">
                {exporting === 'csv' ? '⟳' : '📄'} CSV
              </button>
              <button onClick={() => handleExport('pdf')} disabled={!!exporting}
                className="btn-secondary text-xs">
                {exporting === 'pdf' ? '⟳' : '📑'} PDF
              </button>
            </>
          )}
        </div>
      </div>

      {/* New Posts Banner */}
      {newPostsCount > 0 && (
        <button onClick={() => { dispatch(clearNewPostsCount()); dispatch(fetchPosts({ ...filters, page: 1 })); }}
          className="w-full py-2.5 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-xl text-sm hover:bg-blue-600/30 transition-all">
          ↑ {newPostsCount} new post{newPostsCount > 1 ? 's' : ''} — click to refresh
        </button>
      )}

      {/* Search + Filter Controls */}
      <div className="flex gap-3">
        <div className="flex-1">
          <SearchBar />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`btn-secondary whitespace-nowrap ${showFilters ? 'border-blue-500/50 text-blue-400' : ''}`}
        >
          ⚙ Filters {activeFiltersCount > 0 && (
            <span className="ml-1 w-5 h-5 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && <FilterBar onClose={() => setShowFilters(false)} />}

      {/* Active Filters Summary */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 text-xs">
          {[
            filters.platform && { label: `Platform: ${filters.platform}`, key: 'platform' },
            filters.sentiment && { label: `Sentiment: ${filters.sentiment}`, key: 'sentiment' },
            filters.category && { label: `Category: ${filters.category}`, key: 'category' },
            filters.language && { label: `Language: ${filters.language}`, key: 'language' },
          ].filter(Boolean).map((f) => (
            <span key={f.key} className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 text-blue-300 rounded-full flex items-center gap-1">
              {f.label}
            </span>
          ))}
        </div>
      )}

      {/* Posts Grid */}
      {loading ? (
        <LoadingSkeleton count={9} />
      ) : posts.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-white mb-2">No posts found</h3>
          <p className="text-gray-400 text-sm">Try adjusting your filters or search query</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {posts.map((post, i) => (
            <motion.div key={post._id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.3 }}>
              <PostCard post={post} />
            </motion.div>
          ))}
        </div>
      )}

      <Pagination />
    </div>
  );
}
