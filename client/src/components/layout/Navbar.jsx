import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { searchPosts, setSearchQuery, clearNewPostsCount } from '../../redux/slices/postsSlice';
import { useDebounce } from '../../hooks';

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/posts': 'All Posts',
  '/analytics': 'Analytics',
  '/saved': 'Saved Posts',
  '/settings': 'Settings',
};

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchValue, setSearchValue] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);
  const debouncedSearch = useDebounce(searchValue, 600);
  const { newPostsCount } = useSelector((s) => s.posts);
  const { scrapeStatus } = useSelector((s) => s.ui);

  const pageTitle = PAGE_TITLES[location.pathname] || 'Dashboard';

  useEffect(() => {
    if (debouncedSearch.trim().length >= 2) {
      dispatch(searchPosts({ query: debouncedSearch }));
      dispatch(setSearchQuery(debouncedSearch));
      if (location.pathname !== '/posts') navigate('/posts');
    }
  }, [debouncedSearch, dispatch, navigate, location.pathname]);

  const handleNewPostsClick = () => {
    dispatch(clearNewPostsCount());
    navigate('/');
  };

  return (
    <header className="h-16 bg-dark-900/80 backdrop-blur-md border-b border-white/5 flex items-center px-6 gap-4 shrink-0 z-30 sticky top-0">
      {/* Page Title */}
      <h1 className="text-lg font-semibold text-white hidden md:block">{pageTitle}</h1>

      {/* Search Bar */}
      <div className="flex-1 max-w-md relative">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            ref={searchRef}
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search posts, users, hashtags..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-gray-200 
                       placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all"
            onFocus={() => setShowSearch(true)}
            onBlur={() => setTimeout(() => setShowSearch(false), 200)}
          />
          {searchValue && (
            <button
              onClick={() => { setSearchValue(''); dispatch(setSearchQuery('')); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        {/* Scrape status indicator */}
        {scrapeStatus?.status === 'running' && (
          <div className="flex items-center gap-2 text-xs text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20">
            <span className="animate-spin">⚙</span>
            <span>Scraping...</span>
          </div>
        )}

        {/* New posts notification */}
        <AnimatePresence>
          {newPostsCount > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleNewPostsClick}
              className="flex items-center gap-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 
                         px-3 py-1.5 rounded-full text-xs font-medium hover:bg-blue-600/30 transition-all"
            >
              🔔 {newPostsCount} new posts
            </motion.button>
          )}
        </AnimatePresence>

        {/* Current time */}
        <LiveClock />
      </div>
    </header>
  );
}

function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="text-xs text-gray-500 font-mono hidden lg:block">
      {time.toLocaleTimeString()}
    </span>
  );
}
