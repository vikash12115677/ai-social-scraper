import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser } from './redux/slices/authSlice';
import { useSocket } from './hooks';

// Layout
import MainLayout from './layouts/MainLayout';

// Pages
import Dashboard from './pages/Dashboard';
import AllPosts from './pages/AllPosts';
import Analytics from './pages/Analytics';
import SavedPosts from './pages/SavedPosts';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';

// Components
import LoadingSpinner from './components/common/LoadingSpinner';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((s) => s.auth);
  if (loading) return <LoadingSpinner fullScreen />;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((s) => s.auth);
  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

// Socket initializer component
const SocketInit = () => {
  useSocket();
  return null;
};

export default function App() {
  const dispatch = useDispatch();
  const { token, loading } = useSelector((s) => s.auth);

  useEffect(() => {
    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, [token, dispatch]);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <BrowserRouter>
      <SocketInit />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="posts" element={<AllPosts />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="saved" element={<SavedPosts />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
