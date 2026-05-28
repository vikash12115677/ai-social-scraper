import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toggleSidebar, toggleTheme } from '../../redux/slices/uiSlice';
import { logout } from '../../redux/slices/authSlice';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: '⊞', exact: true },
  { path: '/posts', label: 'All Posts', icon: '📋' },
  { path: '/analytics', label: 'Analytics', icon: '📊' },
  { path: '/saved', label: 'Saved Posts', icon: '🔖' },
  { path: '/settings', label: 'Settings', icon: '⚙️' },
];

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sidebarOpen } = useSelector((s) => s.ui);
  const { user } = useSelector((s) => s.auth);
  const { newPostsCount } = useSelector((s) => s.posts);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <motion.aside
      animate={{ width: sidebarOpen ? 256 : 64 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-full bg-dark-900 border-r border-white/5 flex flex-col z-40 overflow-hidden"
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-white/5 gap-3 shrink-0">
        <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
          🛂
        </div>
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              <p className="text-sm font-semibold text-white whitespace-nowrap">Passport Monitor</p>
              <p className="text-xs text-gray-500 whitespace-nowrap">AI Social Dashboard</p>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="ml-auto text-gray-400 hover:text-white transition-colors shrink-0"
        >
          {sidebarOpen ? '◀' : '▶'}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 mx-2 rounded-xl mb-1 transition-all duration-150 group relative
               ${isActive
                 ? 'bg-blue-600/20 text-blue-400'
                 : 'text-gray-400 hover:text-white hover:bg-white/5'
               }`
            }
          >
            <span className="text-lg shrink-0 w-6 text-center">{item.icon}</span>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm font-medium whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
            {/* New posts badge on Dashboard */}
            {item.path === '/' && newPostsCount > 0 && (
              <span className="absolute right-3 top-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {newPostsCount > 9 ? '9+' : newPostsCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User + Actions */}
      <div className="border-t border-white/5 p-3 shrink-0">
        {/* Theme toggle */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all mb-1"
        >
          <span className="text-lg w-6 text-center shrink-0">🌙</span>
          {sidebarOpen && <span className="text-sm whitespace-nowrap">Toggle Theme</span>}
        </button>

        {/* User info */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 mt-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-xs font-medium text-white truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate capitalize">{user?.role}</p>
              </motion.div>
            )}
          </AnimatePresence>
          {sidebarOpen && (
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-400 transition-colors text-sm shrink-0"
              title="Logout"
            >
              ⏏
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
