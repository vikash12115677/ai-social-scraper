import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchSavedPosts } from '../redux/slices/postsSlice';
import PostCard from '../components/posts/PostCard';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

export default function SavedPosts() {
  const dispatch = useDispatch();
  const { savedPosts, loading } = useSelector((s) => s.posts);

  useEffect(() => {
    dispatch(fetchSavedPosts());
  }, [dispatch]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Saved Posts</h1>
        <p className="text-sm text-gray-400 mt-0.5">{savedPosts.length} bookmarked post{savedPosts.length !== 1 ? 's' : ''}</p>
      </div>

      {loading ? (
        <LoadingSkeleton count={6} />
      ) : savedPosts.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <div className="text-5xl mb-4">🔖</div>
          <h3 className="text-lg font-semibold text-white mb-2">No saved posts yet</h3>
          <p className="text-gray-400 text-sm max-w-sm mx-auto">
            Click the bookmark icon on any post to save it here for later reference.
          </p>
          <a href="/posts" className="inline-block mt-4 btn-primary">Browse Posts</a>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {savedPosts.map((post, i) => (
            <motion.div key={post._id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}>
              <PostCard post={post} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
